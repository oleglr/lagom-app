import React from 'react'
// import AutoSizer from 'react-virtualized-auto-sizer'
import { List, AutoSizer, CellMeasurer } from 'react-virtualized'
import { Message } from './message'

export const VirtualizedList = ({
  RenderComponent,
  items,
  scrollTo,
  cache,
}) => {
  function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    parent,
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) {
    //
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {({ measure }) => (
          <div style={style}>
            <Message message={items[index]} idx={index} measure={measure} />
          </div>
        )}
      </CellMeasurer>
    )
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          rowCount={items.length}
          height={height}
          width={width}
          deferredMeasurementCache={cache}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
          scrollToIndex={scrollTo || items.length}
        />
      )}
    </AutoSizer>
  )
}
