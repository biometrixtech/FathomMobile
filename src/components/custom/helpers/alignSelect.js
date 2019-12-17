export default function(horizontal, scrollAnimation, option, refFlatlist) {
    try {
        if (option) {
            let newPosition = horizontal ? (option.left + option.layout.width / 2) : (option.top + option.layout.width / 2);
            refFlatlist.scrollToOffset({
                animated: scrollAnimation,
                offset:   newPosition,
            });
        }
    } catch (e) {
        console.log('alignSelect - error', e);
    }
}