import React from 'react'
import { List, AutoSizer, CellMeasurer } from 'react-virtualized'
import { Message } from './message'
import { Loader } from '../../../components/elements'

class VirtualizedList extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.scrollTop = -1
        this.scrollHeight = -1
        this.clientHeight = -1
        this.canScroll = false
        this.old_client_height = -1
    }

    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        parent,
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {
        return (
            <CellMeasurer key={key} cache={this.props.cache} parent={parent} columnIndex={0} rowIndex={index}>
                {({ measure }) => (
                    <div style={style} onLoad={measure}>
                        {index === 0 && this.props.isNextPageLoading && !this.props.all_messages_loaded ? (
                            <Loader />
                        ) : (
                            <Message
                                all_items={this.props.items}
                                message={this.props.items[index]}
                                idx={index}
                                measure={measure}
                                isScrolling={isScrolling}
                            />
                        )}
                    </div>
                )}
            </CellMeasurer>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(prevProps.items.length, this.props.items.length)
        const is_new_message = this.props.items.length - prevProps.items.length === 1
        if (prevProps.items.length !== this.props.items.length && !is_new_message) {
            this.props.list_ref.current.scrollToPosition(this.clientHeight)
            this.props.cache.clearAll()
        }
    }

    handleScroll = ({ scrollTop, scrollHeight, clientHeight }) => {
        this.scrollHeight = scrollHeight
        this.clientHeight = clientHeight

        // scroll to bottom in beginning
        const is_at_bottom_of_list = scrollTop + clientHeight === scrollHeight
        if (is_at_bottom_of_list) {
            this.canScroll = -1
        }

        if (scrollTop === 0 && !this.props.all_messages_loaded) {
            this.old_client_height = scrollHeight
            this.props.loadMoreChatHistory()
        }
    }

    render() {
        return (
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        rowCount={this.props.items.length}
                        height={height}
                        width={width}
                        deferredMeasurementCache={this.props.cache}
                        rowHeight={this.props.cache.rowHeight}
                        rowRenderer={this.rowRenderer}
                        ref={this.props.list_ref}
                        sortBy={this.props.sortBy}
                        scrollToIndex={this.canScroll || this.props.items.length}
                        estimatedRowSize={100}
                        onScroll={this.handleScroll}
                        scrollTop={this.scrollTop}
                    />
                )}
            </AutoSizer>
        )
    }
}

export { VirtualizedList }
