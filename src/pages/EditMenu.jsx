import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  writeBatch,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const EditMenu = () => {
  const { restaurantId } = useParams();
  const [menu, setMenu] = useState([]);
  const [user] = useAuthState(auth);
  const [error, setError] = useState(null);
  const [newItems, setNewItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [loading, setLoading] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState(null);

  useEffect(() => {
    const fetchMenuAndOwner = async () => {
      setLoading(true);
      try {
        // Fetch restaurant owner based on new path structure
        const restaurantDocRef = doc(
          db,
          `restaurants/restaurant${restaurantId}`
        );
        const restaurantDoc = await getDoc(restaurantDocRef);

        if (!restaurantDoc.exists()) {
          throw new Error("Restaurant owner not found.");
        }
        const restaurantData = restaurantDoc.data();
        setOwnerEmail(restaurantData.owner); // Assuming `email` is stored in the owner document

        // Fetch menu items
        const menuCollection = collection(
          db,
          `restaurants/restaurant${restaurantId}/menu`
        );
        const menuSnapshot = await getDocs(menuCollection);
        const menuList = menuSnapshot.docs.map((doc) => ({
          id: doc.id, // Add document ID to handle deletion
          ...doc.data(),
        }));
        setMenu(menuList);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuAndOwner();
  }, [restaurantId]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const batch = writeBatch(db);

      // Bulk add items
      newItems.forEach((item, index) => {
        const itemRef = doc(
          db,
          `restaurants/restaurant${restaurantId}/menu`,
          `item${menu.length + index + 1}`
        );
        batch.set(itemRef, { name: item });
      });

      // Update existing items (if needed)
      menu.forEach((item) => {
        const itemRef = doc(
          db,
          `restaurants/restaurant${restaurantId}/menu`,
          item.id
        );
        batch.set(itemRef, { name: item.name });
      });

      await batch.commit();

      // Re-fetch menu to update the UI
      const menuCollection = collection(
        db,
        `restaurants/restaurant${restaurantId}/menu`
      );
      const menuSnapshot = await getDocs(menuCollection);
      const menuList = menuSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenu(menuList);
      setNewItems([]);
      setItemName("");
    } catch (error) {
      console.error("Error saving menu:", error);
      setError("Error saving menu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(
        doc(db, `restaurants/restaurant${restaurantId}/menu`, itemId)
      );
      setMenu(menu.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Error deleting item.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (itemName.trim()) {
      setNewItems([...newItems, itemName]);
      setItemName("");
    }
  };

  const isOwner = user?.email === ownerEmail;
  console.log("Owner Email:", ownerEmail);
  console.log(user.email);

  console.log(isOwner);

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center my-4">
        Edit Menu - Restaurant {restaurantId}
      </h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {loading && <p>Loading...</p>}
      {isOwner ? (
        <div>
          <div className="mb-4">
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Add new dish"
              className="p-2 border rounded"
            />
            <button
              onClick={handleAddItem}
              className="ml-2 p-2 bg-green-500 text-white rounded"
            >
              Add Item
            </button>
          </div>
          <div className="mb-4">
            <h2 className="text-xl">Bulk Adding</h2>
            <ul>
              {newItems.map((item, index) => (
                <li key={index} className="border-b p-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleSave}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Save Changes
          </button>
          <div className="mt-4">
            <h2 className="text-xl">Current Menu</h2>
            {menu.map((item) => (
              <div
                key={item.id}
                className="p-2 border-b flex justify-between items-center"
              >
                <span>{item.name}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>You do not have permission to edit this menu.</p>
      )}
    </div>
  );
};

export default EditMenu;
