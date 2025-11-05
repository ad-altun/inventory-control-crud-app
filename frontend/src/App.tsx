import axios from "axios";
import './App.css';
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "./types/types.ts";
import Modal from "./components/Modal.tsx";
import ProductDetailsCard from "./components/ProductDetailsCard.tsx";
import AddProduct from "./components/AddProduct.tsx";
import Home from "./components/Home.tsx";
import HeaderControl from "./components/HeaderControl.tsx";
import EditProduct from "./components/EditProduct.tsx";
import Pagination from "./components/Pagination.tsx";

function App() {
    const [ products, setProducts ] = useState<Product[]>([]);
    const [ addOpen, setAddOpen ] = useState<boolean>(false);
    const [ editOpen, setEditOpen ] = useState<boolean>(false);
    const [ detailsOpen, setDetailsOpen ] = useState<boolean>(false);
    const [ selectedProduct, setSelectedProduct ] = useState<Product | null>(null);
    const [ selectEditProduct, setSelectEditProduct ] = useState<Product>();
    const [ confirmDeleteProduct, setConfirmDeleteProduct ] = useState<Product | null>(null);
    const [ currentPage, setCurrentPage ] = useState<number>(1);
    const [ itemsPerPage ] = useState<number>(10);
    const [ sortBy, setSortBy ] = useState<string>("default");

    const openDetails = ( p: Product ) => {
        setSelectedProduct(p);
        setDetailsOpen(true);
    };
    const closeDetails = () => {
        setDetailsOpen(false);
        setSelectedProduct(null);
    };

    const openEdit = ( product: Product ) => {
        setSelectEditProduct(product);
        setEditOpen(true);
    };
    const closeEdit = () => {
        setEditOpen(false);
    };

    const getAllProducts = useCallback(async () => {
        {
            await axios.get("api/products").then(
                ( response ) => {
                    setProducts(response.data);
                }
            );
        }
    }, [ setProducts ]);

    function deleteProduct( product: Product ) {
        axios.delete("/api/products/" + product.id).then(getAllProducts);
    }

    useEffect(() => {
        getAllProducts()
            .then();
    }, [ getAllProducts ]);

    const handleProductAdd = ( newProduct: Product ) => {
        if ( newProduct ) {
            setProducts([ newProduct, ...products ]);
        }
        setAddOpen(false); //close modal
        getAllProducts().then();
    };

    const handleProductEdit = ( product: Product ) => {
        if ( product ) {
            setProducts(prevProducts =>
                prevProducts.map(item =>
                    item.id === product.id ? product : item));
        }

        setEditOpen(false);
    };

    //Search Bar Implementation
    const [ query, setQuery ] = useState("");

    const filteredProducts = useMemo(() => {
        const searchQuery = query.trim().toLowerCase();
        if ( !searchQuery ) return products;
        return products.filter(p => {
            const name = ( p.name ?? "" ).toLowerCase();
            const sku = ( p.stockKeepingUnit ?? "" ).toLowerCase();
            const location = ( p.location ?? "" ).toLowerCase();
            return name.includes(searchQuery) || sku.includes(searchQuery) || location.includes(searchQuery);
        });
    }, [ products, query ]);

    // Sorting logic
    const sortedProducts = useMemo(() => {
        if ( sortBy === "default" ) return filteredProducts;

        const sorted = [ ...filteredProducts ];

        switch ( sortBy ) {
            case "price-asc":
                // use nullish coalescing opert. to prevent NaN
                // if returns negative number -> a before b
                // if returns positive -> b before a
                return sorted.sort(( a, b ) => ( a.price ?? 0 ) - ( b.price ?? 0 ));
            case "price-desc":
                return sorted.sort(( a, b ) => ( b.price ?? 0 ) - ( a.price ?? 0 ));
            case "stock-asc":
                return sorted.sort(( a, b ) => ( a.quantity ?? 0 ) - ( b.quantity ?? 0 ));
            case "stock-desc":
                return sorted.sort(( a, b ) => ( b.quantity ?? 0 ) - ( a.quantity ?? 0 ));
            default:
                return sorted;
        }
    }, [ filteredProducts, sortBy ]);

    // Pagination logic
    const paginatedProducts = useMemo(() => {
        const startIndex = ( currentPage - 1 ) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedProducts.slice(startIndex, endIndex);
    }, [ sortedProducts, currentPage, itemsPerPage ]);

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [ query ]);

    return (
        <>
            <div className="app-container">
                <HeaderControl
                    onAddProductClick={ () => setAddOpen(true) }
                    query={ query }
                    onQueryChange={ setQuery }
                    filteredCount={ filteredProducts.length }
                    totalCount={ products.length }
                    sortBy={ sortBy }
                    onSortChange={ setSortBy }
                />
                <Home products={ paginatedProducts }
                      currentPage={ currentPage }
                      itemsPerPage={ itemsPerPage }
                      onProductEditButtonClicked={ openEdit }
                      onProductDetailsButtonClicked={ openDetails }
                      onProductDeleteButtonClicked={ ( product: Product ) =>
                          setConfirmDeleteProduct(product) }
                />
                <Pagination
                    currentPage={ currentPage }
                    totalPages={ totalPages }
                    onPageChange={ setCurrentPage }
                />
                <div className="app-modal">
                    {/* AddProduct modal */ }
                    { addOpen && (
                        <Modal open={ addOpen } title="Add New Product" onClose={ () => setAddOpen(false) }>
                            <AddProduct
                                onProductAdd={ handleProductAdd }
                                onCancel={ () => setAddOpen(false) }
                            />
                        </Modal>
                    ) }

                    { editOpen && selectEditProduct && (
                        <Modal open={ editOpen } title="Edit Product"
                               onClose={ closeEdit }>
                            <EditProduct
                                onProductEdit={ handleProductEdit }
                                onCancel={ () => setEditOpen(false) }
                                product={ selectEditProduct }/>
                        </Modal> )
                    }

                    { detailsOpen && selectedProduct && (
                        <Modal open={ detailsOpen } title="Product Details" onClose={ closeDetails }>
                            <ProductDetailsCard product={ selectedProduct }/>
                        </Modal>
                    ) }
                </div>
            </div>

            { confirmDeleteProduct != null && (
                <Modal open={ true } title={ "Confirm Delete " + confirmDeleteProduct.name }
                       onClose={ () => setConfirmDeleteProduct(null) }>
                    <div style={ { display: "flex", flexDirection: "column" } }>
                        <p>
                            The product { confirmDeleteProduct.name } ({ confirmDeleteProduct.stockKeepingUnit }) will
                            be deleted permanently.
                        </p>
                        { confirmDeleteProduct.quantity != null && confirmDeleteProduct.quantity > 0 ?
                            ( <p style={ { color: "#c00" } }>WARNING: This product
                                has { confirmDeleteProduct.quantity } units in stock!</p> ) : ""
                        }
                        <div style={ { display: "flex", flexDirection: "row", justifyContent: "flex-end" } }>
                            <button style={ { margin: "10px" } } className={ "btn btn-secondary" }
                                    onClick={ () => {
                                        deleteProduct(confirmDeleteProduct);
                                        setConfirmDeleteProduct(null);
                                    } }>
                                Yes
                            </button>
                            <button style={ { margin: "10px" } } className={ "btn btn-primary" }
                                    onClick={ () => {
                                        setConfirmDeleteProduct(null);
                                    } }>
                                No
                            </button>
                        </div>
                    </div>
                </Modal>
            ) }
        </>
    );
}

export default App;
