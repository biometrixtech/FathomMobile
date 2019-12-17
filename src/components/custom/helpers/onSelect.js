export default function(
    nativeEvent,
    selected,
    options,
    handleSelection,
    scrollPosition,
    horizontal
) {
    const cursor = horizontal ? nativeEvent.contentOffset.x : nativeEvent.contentOffset.y;

    if(scrollPosition === null) {
        if(options[selected]) {
            const option = options[selected];
            scrollPosition = horizontal ? option.left : option.top;
        }
    }

    const direction = horizontal ?
        scrollPosition > cursor ?
            'right'
            :
            'left'
        : scrollPosition > cursor ?
            'down'
            :
            'top';

    switch (direction) {
    case 'left':
        if (options[selected + 1]) {
            if (cursor > options[selected].right) {
                handleSelection(
                    cursor,
                    options[selected + 1].item,
                    options[selected + 1].index,
                );
            }
        }
        break;
    case 'right':
        if (options[selected - 1]) {
            if (cursor < options[selected].left) {
                handleSelection(
                    cursor,
                    options[selected - 1].item,
                    options[selected - 1].index,
                );
            }
        }
        break;
    case 'top':
        if (options[selected + 1]) {
            if (cursor > options[selected].bottom) {
                handleSelection(
                    cursor,
                    options[selected + 1].item,
                    options[selected + 1].index,
                );
            }
        }
        break;
    case 'down':
        if (options[selected - 1]) {
            if (cursor < options[selected].top) {
                handleSelection(
                    cursor,
                    options[selected - 1].item,
                    options[selected - 1].index,
                );
            }
        }
        break;
    default:
        break;
    }
}