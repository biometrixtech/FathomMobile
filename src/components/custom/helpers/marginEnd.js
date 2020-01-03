export default function marginEnd(
    horizontal,
    length,
    index,
    size,
    offset,
    manualMargin
) {
    return horizontal
        ? index === length
            ? manualMargin
                ? manualMargin
                : size / 2 - offset
            : 0
        : 0;
}