type HeaderControlProps = {
    onAddProductClick: () => void;
    query: string;
    onQueryChange: ( v: string ) => void;
    filteredCount: number;
    totalCount: number;
    sortBy: string;
    onSortChange: ( sort: string ) => void;
};

export default function HeaderControl( {
    onAddProductClick,
    query,
    onQueryChange,
    filteredCount,
    totalCount,
    sortBy,
    onSortChange,
}: HeaderControlProps ) {
    return (
        <div className="header-container">
            <div className="app-title">
                <h1>Warehouse Management</h1>
            </div>
            <div className="header-controls">
                {/*Header area*/ }
                <div style={ {
                    fontSize: 14,
                    color: "#666",
                    textAlign: "left",
                    paddingBottom: "0.5rem",
                    paddingLeft: "0.50rem"
                } }>
                    { filteredCount } of { totalCount } items listed
                </div>
                <div className="table-toolbar">
                    <button className="btn" onClick={ onAddProductClick }>
                        Add Product
                    </button>
                </div>
            </div>
            <div className="header-sort">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search name, SKU, or location…"
                        aria-label="Search products"
                        value={ query }
                        onChange={ ( e ) => onQueryChange(e.target.value) }
                    />
                </div>
                {/* Add Sort Dropdown */ }
                <div className="sort-box">
                    <select
                        value={ sortBy }
                        onChange={ ( e ) => onSortChange(e.target.value) }
                        className="sort-select"
                    >
                        <option value="default">Sort by...</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="stock-asc">Stock: Low to High</option>
                        <option value="stock-desc">Stock: High to Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
