import React from "react";
import { Modal } from "antd";

const ViewSavedCardsModal = ({ visible, onCancel, savedCards }) => {
  return (
    <Modal
      title="Saved Cards"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {savedCards.length > 0 ? (
          savedCards.map((card) => (
            <div
              key={card.id}
              className="p-4 border rounded-lg shadow-lg bg-white"
            >
              <img
                src={card.images[0]}
                alt={card.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div>
                <p className="text-lg font-medium text-gray-900 truncate">
                  {card.title}
                </p>
                <p className="text-gray-600">${card.price}</p>
                <p className="text-gray-500 text-sm truncate">
                  {card.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No saved cards found.</p>
        )}
      </div>
    </Modal>
  );
};

export default ViewSavedCardsModal;
