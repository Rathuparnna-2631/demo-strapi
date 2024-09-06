module.exports = {
    afterCreate: async (event) => {
      const { result } = event;
      const firebaseSync = strapi.service('api::product.firebase-sync');
      await firebaseSync.syncToFirebase(result);
    },
    afterUpdate: async (event) => {
      const { result } = event;
      const firebaseSync = strapi.service('api::product.firebase-sync');
      await firebaseSync.syncToFirebase(result, true);
    },
    afterDelete: async (event) => {
        const { result } = event;
        const firebaseSync = strapi.service('api::product.firebase-sync');
        await firebaseSync.deleteFromFirebase(result.id);
      }
  };