import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "talks/acme-talk/demos");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));

export default function () {
    const before = read("1-readiness/cache/audit-before.json").systems["acme-before"].score;
    const after = read("1-readiness/cache/audit-after.json").systems["acme"].score;
    const checks = after.surface.checks.map((c) => ({
        title: c.title,
        before: before.surface.checks.find((b) => b.id === c.id)?.score,
        after: c.score,
    }));
    const { classification } = read("2-token-sync/cache/classification.json");

    return {
        readiness: {
            before: before.composite,
            after: after.composite,
            tier: after.tier,
            checks,
        },
        sync: classification,
    };
}
