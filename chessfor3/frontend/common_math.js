export function getX(angle) {
    return Math.cos(toRad(angle));
}

export function getY(angle) {
    return Math.sin(toRad(angle));
}

export function toRad(angle) {
    return (Math.PI / 180) * angle;
}
