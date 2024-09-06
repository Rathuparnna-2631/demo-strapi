const { db } = require('../../../../config/firebase-config');
const { collection, setDoc, doc, deleteDoc } = require("firebase/firestore");

module.exports = {
  syncToFirebase: async (data, isUpdate = false) => {
    try {
      console.log('Received data:', JSON.stringify(data, null, 2));

      let productData;

      if (data.attributes) {
        // Structure for afterCreate and afterUpdate events
        const { id, attributes } = data;
        productData = {
          id,
          productname: attributes.productname,
          productDetails: attributes.productDetails,
          slug: attributes.slug,
          productImage: attributes.productImage?.data?.map(image => ({
            url: image.attributes.url,
            name: image.attributes.name,
          })) || []
        };
      } else {
        // Structure for direct API calls or different event structure
        productData = {
          id: data.id,
          productname: data.productname,
          productDetails: data.productDetails,
          slug: data.slug,
          productImage: data.productImage?.map(image => ({
            url: image.url,
            name: image.name,
          })) || []
        };
      }

      console.log('Processed productData:', JSON.stringify(productData, null, 2));

      const docRef = doc(db, "products", productData.id.toString());
      
      // Use setDoc with merge option to handle both create and update
      await setDoc(docRef, productData, { merge: true });
      console.log("Document written with ID: ", productData.id);

      return true;
    } catch (error) {
      console.error("Error syncing document to Firebase: ", error);
      console.error("Stack trace: ", error.stack);
      return false;
    }
  },
  deleteFromFirebase: async (id) => {
    try {
      const docRef = doc(db, "products", id.toString());
      await deleteDoc(docRef);
      console.log("Document successfully deleted from Firebase: ", id);
      return true;
    } catch (error) {
      console.error("Error deleting document from Firebase: ", error);
      console.error("Stack trace: ", error.stack);
      return false;
    }
  }
};