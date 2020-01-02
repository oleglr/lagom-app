import React from 'react'
import { List, AutoSizer, CellMeasurer } from 'react-virtualized'
import { Message } from './message'

class VirtualizedList extends React.Component {
    _did_render = false

    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        parent,
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {
        return (
            <CellMeasurer
                key={key}
                cache={this.props.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
            >
                {({ measure }) => (
                    <div style={style}>
                        <Message
                            message={this.props.items[index]}
                            idx={index}
                            measure={measure}
                            is_thread={this.props.is_thread}
                        />
                    </div>
                )}
            </CellMeasurer>
        )
    }

    componentDidUpdate() {
        // Dirty hack to scroll to bottom of list at beginning
        if (this.props.t === 'now' && !this._did_render) {
            this.props.list_ref.current.scrollToRow(this.props.items.length)
            this._did_render = true
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
                    />
                )}
            </AutoSizer>
        )
    }
}

export { VirtualizedList }
