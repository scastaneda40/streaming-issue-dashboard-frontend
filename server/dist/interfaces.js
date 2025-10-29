"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Severity = exports.Status = exports.Platform = void 0;
var Platform;
(function (Platform) {
    Platform["DISNEY_PLUS"] = "DISNEY_PLUS";
    Platform["ESPN_PLUS"] = "ESPN_PLUS";
    Platform["HULU"] = "HULU";
    Platform["STAR_PLUS"] = "STAR_PLUS";
})(Platform || (exports.Platform = Platform = {}));
var Status;
(function (Status) {
    Status["OPEN"] = "OPEN";
    Status["IN_PROGRESS"] = "IN_PROGRESS";
    Status["RESOLVED"] = "RESOLVED";
    Status["CLOSED"] = "CLOSED";
})(Status || (exports.Status = Status = {}));
var Severity;
(function (Severity) {
    Severity["LOW"] = "LOW";
    Severity["MEDIUM"] = "MEDIUM";
    Severity["HIGH"] = "HIGH";
    Severity["CRITICAL"] = "CRITICAL";
})(Severity || (exports.Severity = Severity = {}));
