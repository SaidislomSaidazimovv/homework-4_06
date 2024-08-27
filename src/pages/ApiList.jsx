import React, { useEffect, useState, useReducer } from "react";
import { Spin, Alert, Modal, Input, Button } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  reducer,
  initialState,
  actionTypes,
} from "../components/savedCardsReducer";
import ViewSavedCardsModal from "../components/ViewSavedCardsModal";
import { EyeOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useAxios } from "../hooks/useAxios";

const { Search } = Input;

const ApiList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const pageSize = 7;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await useAxios().get(
          `/products?offset=${(currentPage - 1) * pageSize}&limit=${pageSize}`
        );
        if (response.data.length > 0) {
          setProducts((prevProducts) => [...prevProducts, ...response.data]);
          if (response.data.length < pageSize) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    if (searchTerm) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleDeleteProduct = async () => {
    try {
      await useAxios().delete(`/products/${productToDelete}`);
      setProducts(products.filter((product) => product.id !== productToDelete));
      setFilteredProducts(
        filteredProducts.filter((product) => product.id !== productToDelete)
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      setError(error.message);
      toast.error("Failed to delete product");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const openDeleteModal = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
    setShowSavedModal(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSaveCard = (product) => {
    dispatch({ type: actionTypes.ADD_CARD, payload: product });
    toast.success("Product saved successfully");
  };

  const handleViewSaved = () => {
    setShowSavedModal(true);
  };

  if (loading && currentPage === 1)
    return (
      <Spin
        size="large"
        className="flex justify-center items-center h-screen"
      />
    );
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Product List</h1>
        <div className="mb-4">
          <Button
            size="large"
            onClick={handleViewSaved}
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
          >
            <EyeOutlined /> View
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search products"
          size="large"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="transition-transform transform hover:scale-105 p-4 border rounded-lg shadow-lg bg-white hover:shadow-xl hover:bg-gray-50"
          >
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div>
              <p className="text-lg font-medium text-gray-900 truncate">
                {product.title}
              </p>
              <p className="text-gray-600">${product.price}</p>
              <p className="text-gray-500 text-sm truncate">
                {product.description}
              </p>
            </div>
            <Button
              size="large"
              icon={<SaveOutlined />}
              onClick={() => handleSaveCard(product)}
              className="mt-4 bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 w-full"
            >
              Save
            </Button>
            <Button
              size="large"
              icon={<DeleteOutlined />}
              onClick={() => openDeleteModal(product.id)}
              className="mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 w-full"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      {!searchTerm && hasMore && (
        <Button
          size="large"
          onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 mt-6 block mx-auto"
        >
          Load More
        </Button>
      )}

      <Modal
        title="Confirm Deletion"
        visible={showDeleteModal}
        onOk={handleDeleteProduct}
        onCancel={handleCancel}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>

      <ViewSavedCardsModal
        visible={showSavedModal}
        onCancel={handleCancel}
        savedCards={state.savedCards}
      />

      <ToastContainer position="top-center" />
    </div>
  );
};

export default ApiList;
