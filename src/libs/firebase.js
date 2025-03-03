// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  or,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { COLLECTIONNAME, firebaseConfig } from './firebaseConfig'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

class Firebase {
  constructor() {
    this.app = initializeApp(firebaseConfig)
    this.db = getFirestore(this.app)
  }

  // methods
  // Current user
  getCurrentUser() {
    const auth = getAuth()
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log(user.email)
      } else {
        console.log('User not logged in')
      }
    })
  }

  // Google authentication
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account',
      })
      const auth = getAuth()
      const result = await signInWithPopup(auth, provider)
      console.log(result.user.email)
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async signOutWithGoogle() {
    try {
      const auth = getAuth()
      const signOutRef = await signOut(auth)
      console.log(signOutRef)
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  // CRUD operations
  async createDoc(doc) {
    try {
      const docsCol = collection(this.db, COLLECTIONNAME)
      const newDocRef = await addDoc(docsCol, doc)
      console.log(newDocRef)
      return newDocRef.id
    } catch (error) {
      console.log('Service error while creating document', error)
      throw error
    }
  }

  async getDocuments(compound, queryParamsList) {
    try {
      const documentsCollection = collection(this.db, COLLECTIONNAME)
      let whereList = []
      queryParamsList.forEach(queryParams => {
        const { field, condition, value } = queryParams
        if (!field || !condition || !value) {
          throw new Error('Please provide a valid query')
        }
        whereList.push(where(field, condition, value))
      })
      const documentsQuery =
        compound === 'or'
          ? query(documentsCollection, or(...whereList))
          : query(documentsCollection, and(...whereList))
      const documentsSnapshot = await getDocs(documentsQuery)
      const documentsList = documentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      return documentsList
    } catch (error) {
      console.log('Service error while reading documents =>', error)
      throw error
    }
  }

  async getDocument(documentId) {
    try {
      const documentReference = doc(this.db, COLLECTIONNAME, documentId)
      const documentSnapshot = await getDoc(documentReference)
      if (!documentSnapshot.exists()) {
        throw new Error('Please provide a valid document id')
      }
      const documentDetails = {
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      }
      return documentDetails
    } catch (error) {
      console.log('Service error while reading document =>', error)
      throw error
    }
  }

  async updateDocument(selectedDocumentId, updatedDocumentFields) {
    try {
      const documentReference = doc(this.db, COLLECTIONNAME, selectedDocumentId)
      await updateDoc(documentReference, updatedDocumentFields)
    } catch (error) {
      console.log('Service error while updating the document =>', error)
      throw error
    }
  }

  async deleteDocument(selectedDocumentId) {
    try {
      const documentReference = doc(this.db, COLLECTIONNAME, selectedDocumentId)
      const deleteDocumentReference = await deleteDoc(documentReference)
      console.log(deleteDocumentReference)
      return deleteDocumentReference
    } catch (error) {
      console.log('Service error while deleting the document =>', error)
      throw error
    }
  }
}

const firebase = new Firebase()

export default firebase
