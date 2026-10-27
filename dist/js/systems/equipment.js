export const rotorEquipment = { id: 'rotor', cost: 550, secondsPerTurn: 3.2 };
export function equipmentPreparation(g) { return !g.started || g.ended; }
export function buyRotor(g) {
    const p = g.profile;
    if (!equipmentPreparation(g) || p.rotorOwned || !Number.isFinite(p.wallet) || p.wallet < rotorEquipment.cost)
        return false;
    p.wallet -= rotorEquipment.cost;
    p.rotorOwned = true;
    p.rotorOn = true;
    return true;
}
export function setRotor(g, on) { if (!equipmentPreparation(g) || !g.profile.rotorOwned)
    return false; g.profile.rotorOn = on; return true; }
export function rotorWorking(g) { return !!(g.profile.rotorOwned && g.profile.rotorOn && !g.tutorial && g.cooking.stage === 'batter'); }
export function tickRotor(g, dt) {
    if (!g.started || g.ended || g.paused || !Number.isFinite(dt) || dt <= 0)
        return;
    dt = Math.min(dt, .1);
    const p = g.cooking, working = rotorWorking(g);
    p.rotorDeploy = Math.min(1, Math.max(0, p.rotorDeploy + (working ? 1 : -1) * dt * 3));
    if (!working || p.rotorDeploy < 1)
        return;
    p.rotorAngle += dt * Math.PI * 2 / rotorEquipment.secondsPerTurn;
    // The moving blade uses the same local spreading rule as the player's tool.
    p.spreadBatter(640 + Math.cos(p.rotorAngle) * 135, 505 + Math.sin(p.rotorAngle) * 58, dt * 135);
}
