import { useState, useEffect } from "react";
import { LibraryContractAddress } from "../config.js";
import { ethers } from "ethers";
import axios from "axios";

import Library from "../utils/Library.json";

import Book from "./components/Book";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const [txError, setTxError] = useState("");

  const [books, setBooks] = useState<any[]>([]);
  const [bookName, setBookName] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookYear, setBookYear] = useState("");
  const [bookFinished, setBookFinished] = useState("");

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCorrectNetwork(true);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0]);
      setCorrectNetwork(true);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getBooks = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = provider.getSigner();
        const LibraryContract = new ethers.Contract(
          LibraryContractAddress,
          Library.abi,
          await signer
        );

        let booksFinished = await LibraryContract.getFinishedBooks();

        let booksUnFinished = await LibraryContract.getUnfinishedBooks();

        console.log(booksUnFinished);
        console.log("Books:- ");
        console.log(booksFinished);

        let books = booksFinished.concat(booksUnFinished);
        setBooks(books);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setTxError(`${error}`);
    }
  };

  const clickBookFinished = async (id: any) => {
    console.log(id);

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = provider.getSigner();
        const LibraryContract = new ethers.Contract(
          LibraryContractAddress,
          Library.abi,
          await signer
        );

        let libraryTx = await LibraryContract.setFinished(id, true);

        console.log(libraryTx);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error Submitting new Book", error);
      setTxError(`${error}`);
      console.log(error);
    }
  };

  const submitBook = async () => {
    let book = {
      name: bookName,
      year: parseInt(bookYear),
      author: bookAuthor,
      finished: bookFinished == "yes" ? true : false,
    };

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = provider.getSigner();
        const LibraryContract = new ethers.Contract(
          LibraryContractAddress,
          Library.abi,
          await signer
        );

        let libraryTx = await LibraryContract.addBook(
          book.name,
          book.year,
          book.author,
          book.finished
        );

        console.log(libraryTx);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error Submitting new Book", error);
      setTxError(`${error}`);
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
    getBooks();
  }, []);
  return (
    <div className="flex flex-col items-center bg-[#f3f6f4] text-[#6a50aa] min-h-screen">
      <div className="trasition hover:rotate-180 hover:scale-105 transition duration-500 ease-in-out"></div>
      <h2 className="text-3xl font-bold mb-20 mt-12">
        Manage your Library Catalog
      </h2>
      {currentAccount === "" ? (
        <button
          className="text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : correctNetwork ? (
        <h4 className="text-3xl font-bold mb-20 mt-12">Wallet Connected</h4>
      ) : (
        <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
          <div>----------------------------------------</div>
          <div>Please connect to the Rinkeby Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )}
      <div className="text-xl font-semibold mb-20 mt-4">
        <input
          className="text-xl font-bold mb-2 mt-1"
          type="text"
          placeholder="Book Name"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
        />
        <br />
        <input
          className="text-xl font-bold mb-2 mt-1"
          type="text"
          placeholder="Book Author"
          value={bookAuthor}
          onChange={(e) => setBookAuthor(e.target.value)}
        />
        <br />
        <input
          className="text-xl font-bold mb-2 mt-1"
          type="text"
          placeholder="Book Year"
          value={bookYear}
          onChange={(e) => setBookYear(e.target.value)}
        />
        <br />
        <label>
          Have you Finished reading this book?
          <select
            value={bookFinished}
            onChange={(e) => setBookFinished(e.target.value)}
          >
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </label>
        <button
          className="text-xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
          onClick={submitBook}
        >
          Add Book
        </button>
      </div>
      {
        <div className="flex flex-col justify-center items-center">
          <div className="font-semibold text-lg text-center mb-4">
            Books List
          </div>
          <button
            className="text-xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
            onClick={getBooks}
          >
            Get Books
          </button>
          {books.map((book) => (
            <Book
              key={book.id}
              id={parseInt(book.id)}
              name={book.name}
              year={parseInt(book.year).toString()}
              author={book.author}
              finished={book.finished.toString()}
              clickBookFinished={clickBookFinished}
            />
          ))}
        </div>
      }
    </div>
  );
}
