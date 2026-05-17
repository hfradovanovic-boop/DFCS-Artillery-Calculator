(function () {
    const CONFIG = window.DFCS_FIREBASE_CONFIG || {};
    const SESSION_KEY = "dfcsSessionCode";
    const REMOTE_PREFIX = "sessions";
    const staticSharedKeys = new Set([
        "pendingFiringSolutions",
        "latestFiringSolutions",
        "missionStatusReports",
        "dfcsReadyState",
        "fireCommand",
        "shotReport",
        "roundsCompleteReport",
        "missionDenyReport",
        "dfcsPing",
        "fdcPingAck",
        "fdcPing",
        "dfcsPingAck",
        "firingUnitLocationUpdate",
        "endMissionReport",
        "fireWorkflowTarget",
    ]);
    const unitLabels = ["A", "B", "C", "D"];
    const unitSharedSuffixes = [
        "Callsign",
        "Location",
        "Altitude",
        "OperationalStatus",
        "PendingLocation",
        "Presence",
    ];
    const unitReportKeys = ["missionReceivedReport", "dfcsReadyState", "shotReport", "roundsCompleteReport"];
    let db = null;
    let applyingRemote = false;
    const originalSetItem = localStorage.setItem.bind(localStorage);
    const originalRemoveItem = localStorage.removeItem.bind(localStorage);

    ["1", "2", "3", "4"].forEach(fdc => {
        staticSharedKeys.add(`fdc${fdc}FireUnitSize`);
        staticSharedKeys.add(`fdc${fdc}WeaponSystem`);
        staticSharedKeys.add(`fdc${fdc}RoomStartedAt`);
    });

    unitLabels.forEach(label => {
        unitSharedSuffixes.forEach(suffix => {
            ["1", "2", "3", "4"].forEach(fdc => {
                staticSharedKeys.add(`firingUnit${fdc}${label}${suffix}`);
            });
        });
        ["1", "2", "3", "4"].forEach(fdc => {
            staticSharedKeys.add(`dfcsDeniedMission${fdc}${label}`);
            unitReportKeys.forEach(key => {
                staticSharedKeys.add(`${key}${fdc}${label}`);
            });
        });
    });

    function normalizeSessionCode(value) {
        return (value || "")
            .toString()
            .trim()
            .toUpperCase()
            .replace(/[^A-Z0-9_-]/g, "")
            .slice(0, 24);
    }

    function getUrlSessionCode() {
        const params = new URLSearchParams(window.location.search);
        return normalizeSessionCode(params.get("session"));
    }

    function getSessionCode() {
        const fromUrl = getUrlSessionCode();
        if (fromUrl) {
            originalSetItem(SESSION_KEY, fromUrl);
            return fromUrl;
        }
        return normalizeSessionCode(localStorage.getItem(SESSION_KEY) || "");
    }

    function setSessionCode(value) {
        const sessionCode = normalizeSessionCode(value);
        if (!sessionCode) return "";
        originalSetItem(SESSION_KEY, sessionCode);
        return sessionCode;
    }

    function isConfigured() {
        return Boolean(
            CONFIG.enabled &&
            CONFIG.apiKey &&
            CONFIG.databaseURL &&
            !CONFIG.apiKey.includes("PASTE_") &&
            window.firebase &&
            window.firebase.database
        );
    }

    function getDb() {
        if (!isConfigured()) return null;
        if (!db) {
            if (!window.firebase.apps.length) {
                window.firebase.initializeApp(CONFIG);
            }
            db = window.firebase.database();
        }
        return db;
    }

    function pathForKey(key) {
        const sessionCode = getSessionCode();
        if (!sessionCode) return "";
        return `${REMOTE_PREFIX}/${sessionCode}/kv/${key}`;
    }

    function isSharedKey(key) {
        return staticSharedKeys.has(key);
    }

    function writeRemote(key, rawValue) {
        const database = getDb();
        const path = pathForKey(key);
        if (!database || !path) return;

        const ref = database.ref(path);
        if (key.endsWith("Presence")) {
            ref.onDisconnect().remove();
        }
        ref.set({
            value: rawValue,
            updatedAt: new Date().toISOString(),
        });
    }

    function removeRemote(key) {
        const database = getDb();
        const path = pathForKey(key);
        if (!database || !path) return;
        database.ref(path).remove();
    }

    function applyRemoteValue(key, snapshot) {
        applyingRemote = true;
        try {
            const data = snapshot.val();
            if (!data || data.value === undefined || data.value === null) {
                originalRemoveItem(key);
            } else {
                originalSetItem(key, data.value);
            }
            window.dispatchEvent(new CustomEvent("dfcs-sync-update", { detail: { key } }));
        } finally {
            applyingRemote = false;
        }
    }

    function listenToSharedKeys() {
        const database = getDb();
        const sessionCode = getSessionCode();
        if (!database || !sessionCode) return;

        staticSharedKeys.forEach(key => {
            database.ref(pathForKey(key)).on("value", snapshot => applyRemoteValue(key, snapshot));
        });
    }

    localStorage.setItem = function patchedSetItem(key, value) {
        originalSetItem(key, value);
        if (!applyingRemote && isSharedKey(key)) {
            writeRemote(key, value);
        }
    };

    localStorage.removeItem = function patchedRemoveItem(key) {
        originalRemoveItem(key);
        if (!applyingRemote && isSharedKey(key)) {
            removeRemote(key);
        }
    };

    window.DFCS_SYNC = {
        getSessionCode,
        setSessionCode,
        isConfigured,
        isOnline: () => Boolean(getDb() && getSessionCode()),
        sharedKeys: staticSharedKeys,
        start: listenToSharedKeys,
    };

    document.addEventListener("DOMContentLoaded", listenToSharedKeys);
})();
