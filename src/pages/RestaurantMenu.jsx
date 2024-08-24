import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const RestaurantMenu = () => {
  const { restaurantId } = useParams(); // Get the restaurant ID from the URL
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState(null); // To capture and display errors

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Construct the correct path for the menu sub-collection
        const menuCollection = collection(
          db,
          `restaurants/restaurant${restaurantId}/menu`
        );
        const menuSnapshot = await getDocs(menuCollection);

        if (menuSnapshot.empty) {
          throw new Error("No menu items found.");
        }

        const menuList = menuSnapshot.docs.map((doc) => doc.data());
        setMenu(menuList);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setError(error.message); // Set error message for display
      }
    };

    fetchMenu();
  }, [restaurantId]);

  return (
    <>
      <div className="p-4">
        <h1 className="text-3xl text-center my-4">
          Menu - Restaurant {restaurantId}
        </h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          menu.map((item, index) => (
            <div key={index} className="p-4 border-b">
              <h2 className="text-xl">{item.name}</h2>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default RestaurantMenu;
