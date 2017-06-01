'use strict';

(function (global) {

    var STATE_PLAINTEXT = Symbol('plaintext');
    var STATE_HTML = Symbol('html');
    var STATE_COMMENT = Symbol('comment');

    var ALLOWED_TAGS_REGEX = /<(\w*)>/g;
    var NORMALIZE_TAG_REGEX = /<\/?([^\s\/>]+)/;

    function striptags(html, allowable_tags, tag_replacement) {
        html = html || '';
        allowable_tags = allowable_tags || [];
        tag_replacement = tag_replacement || '';

        var context = init_context(allowable_tags, tag_replacement);

        return striptags_internal(html, context);
    }

    function init_striptags_stream(allowable_tags, tag_replacement) {
        allowable_tags = allowable_tags || [];
        tag_replacement = tag_replacement || '';

        var context = init_context(allowable_tags, tag_replacement);

        return function striptags_stream(html) {
            return striptags_internal(html || '', context);
        };
    }

    striptags.init_streaming_mode = init_striptags_stream;

    function init_context(allowable_tags, tag_replacement) {
        allowable_tags = parse_allowable_tags(allowable_tags);

        return {
            allowable_tags: allowable_tags,
            tag_replacement: tag_replacement,

            state: STATE_PLAINTEXT,
            tag_buffer: '',
            depth: 0,
            in_quote_char: ''
        };
    }

    function striptags_internal(html, context) {
        var allowable_tags = context.allowable_tags;
        var tag_replacement = context.tag_replacement;

        var state = context.state;
        var tag_buffer = context.tag_buffer;
        var depth = context.depth;
        var in_quote_char = context.in_quote_char;
        var output = '';

        for (var idx = 0, length = html.length; idx < length; idx++) {
            var char = html[idx];

            if (state === STATE_PLAINTEXT) {
                switch (char) {
                    case '<':
                        state = STATE_HTML;
                        tag_buffer += char;
                        break;

                    default:
                        output += char;
                        break;
                }
            } else if (state === STATE_HTML) {
                switch (char) {
                    case '<':
                        if (in_quote_char) {
                            break;
                        }

                        depth++;
                        break;

                    case '>':
                        if (in_quote_char) {
                            break;
                        }

                        if (depth) {
                            depth--;

                            break;
                        }

                        in_quote_char = '';
                        state = STATE_PLAINTEXT;
                        tag_buffer += '>';

                        if (allowable_tags.has(normalize_tag(tag_buffer))) {
                            output += tag_buffer;
                        } else {
                            output += tag_replacement;
                        }

                        tag_buffer = '';
                        break;

                    case '"':
                    case '\'':

                        if (char === in_quote_char) {
                            in_quote_char = '';
                        } else {
                            in_quote_char = in_quote_char || char;
                        }

                        tag_buffer += char;
                        break;

                    case '-':
                        if (tag_buffer === '<!-') {
                            state = STATE_COMMENT;
                        }

                        tag_buffer += char;
                        break;

                    case ' ':
                    case '\n':
                        if (tag_buffer === '<') {
                            state = STATE_PLAINTEXT;
                            output += '< ';
                            tag_buffer = '';

                            break;
                        }

                        tag_buffer += char;
                        break;

                    default:
                        tag_buffer += char;
                        break;
                }
            } else if (state === STATE_COMMENT) {
                switch (char) {
                    case '>':
                        if (tag_buffer.slice(-2) == '--') {
                            state = STATE_PLAINTEXT;
                        }

                        tag_buffer = '';
                        break;

                    default:
                        tag_buffer += char;
                        break;
                }
            }
        }

        context.state = state;
        context.tag_buffer = tag_buffer;
        context.depth = depth;
        context.in_quote_char = in_quote_char;

        return output;
    }

    function parse_allowable_tags(allowable_tags) {
        var tags_array = [];

        if (typeof allowable_tags === 'string') {
            var match = void 0;

            while ((match = ALLOWED_TAGS_REGEX.exec(allowable_tags)) !== null) {
                tags_array.push(match[1]);
            }
        } else if (typeof allowable_tags[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator'] === 'function') {
            tags_array = allowable_tags;
        }

        return new Set(tags_array);
    }

    function normalize_tag(tag_buffer) {
        var match = NORMALIZE_TAG_REGEX.exec(tag_buffer);

        return match ? match[1].toLowerCase() : null;
    }

    if (typeof define === 'function' && define.amd) {
        define(function module_factory() {
            return striptags;
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = striptags;
    } else {
        global.striptags = striptags;
    }
})(this);