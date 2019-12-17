export default function marginStart(horizontal, index, size, offset, manualMargin) {
  return horizontal
    ? index === 0
      ? manualMargin
        ? manualMargin
        : size / 2 + offset
      : 0
    : 0;
}