"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = getPool;
exports.initDb = initDb;
var pg_1 = require("pg");
var pool = null;
function getPool() {
    if (!pool) {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not set");
        }
        pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
    }
    return pool;
}
function initDb() {
    return __awaiter(this, void 0, void 0, function () {
        var p, e_1, e_2, e_3;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!process.env.DATABASE_URL) {
                        console.warn("DATABASE_URL is not set. Skipping DB initialization.");
                        return [2 /*return*/];
                    }
                    p = getPool();
                    // enables pgcrypto for gen_random_uuid if available
                    return [4 /*yield*/, p.query("create extension if not exists pgcrypto;").catch(function () { })];
                case 1:
                    // enables pgcrypto for gen_random_uuid if available
                    _d.sent();
                    return [4 /*yield*/, p.query("\n    create table if not exists users (\n      id uuid primary key default gen_random_uuid(),\n      email text not null unique,\n      password_hash text,\n      google_id text,\n      first_name text,\n      last_name text,\n      role text not null default 'user',\n      created_at timestamptz not null default now(),\n      updated_at timestamptz not null default now()\n    );\n  ")];
                case 2:
                    _d.sent();
                    // Create notes table
                    return [4 /*yield*/, p.query("\n    create table if not exists notes (\n      id uuid primary key default gen_random_uuid(),\n      title text not null,\n      course text not null,\n      professor text not null,\n      semester text not null,\n      description text,\n      file_key text not null,\n      file_name text not null,\n      file_size text not null,\n      file_type text not null,\n      status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),\n      uploaded_by uuid not null references users(id),\n      approved_by uuid references users(id),\n      created_at timestamptz not null default now(),\n      updated_at timestamptz not null default now()\n    );\n  ")];
                case 3:
                    // Create notes table
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, p.query("create type note_status as enum ('pending', 'approved', 'rejected');")];
                case 5:
                    _d.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _d.sent();
                    // enum already exists, ignore error
                    if (!((_a = e_1.message) === null || _a === void 0 ? void 0 : _a.includes('already exists'))) {
                        console.warn('Could not create note_status enum:', e_1.message);
                    }
                    return [3 /*break*/, 7];
                case 7:
                    _d.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, p.query("ALTER TABLE users ADD COLUMN google_id text;")];
                case 8:
                    _d.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_2 = _d.sent();
                    // column already exists, ignore error
                    if (!((_b = e_2.message) === null || _b === void 0 ? void 0 : _b.includes('already exists'))) {
                        console.warn('Could not add google_id column:', e_2.message);
                    }
                    return [3 /*break*/, 10];
                case 10: 
                // ensures partial unique index for google_id when present
                return [4 /*yield*/, p
                        .query("create unique index if not exists idx_users_google_id on users(google_id) where google_id is not null;")
                        .catch(function () { })];
                case 11:
                    // ensures partial unique index for google_id when present
                    _d.sent();
                    _d.label = 12;
                case 12:
                    _d.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, p.query("ALTER TABLE users ADD COLUMN role text not null default 'user';")];
                case 13:
                    _d.sent();
                    return [3 /*break*/, 15];
                case 14:
                    e_3 = _d.sent();
                    // column already exists, ignore error
                    if (!((_c = e_3.message) === null || _c === void 0 ? void 0 : _c.includes('already exists'))) {
                        console.warn('Could not add role column:', e_3.message);
                    }
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
