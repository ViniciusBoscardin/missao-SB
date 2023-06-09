import { use, useEffect, useState } from "react";
import {
  QueryClient,
  useQuery,
  useQueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import "../app/globals.css";

const fetchBookDetails = async (bookId: string) => {
  const response = await fetch(`https://openlibrary.org${bookId}.json`);
  const data = await response.json();
  return data;
};

export default function SearchInput() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const pageSize = 10;

  const fetchBooks = async (searchTerm: string, pageStyle: number) => {
    console.log(pageStyle);
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${searchTerm}&limit=${pageSize}&page=${pageStyle}`
    );
    const data = await response.json();

    if (data.docs) {
      return data.docs.slice(0, pageSize).map((book: any) => ({
        key: book.key,
        title: book.title,
        first_publish_year: book.first_publish_year,
        author_name: book.author_name?.[0],
      }));
    }
    return [];
  };
  const { data, isLoading, isError, isPreviousData } = useQuery({
    queryKey: ["books", searchTerm, page],
    queryFn: () => fetchBooks(searchTerm, page),
    keepPreviousData: true,
  });
  console.log(data);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (!isPreviousData) {
      queryClient.prefetchQuery(["books", searchTerm, page + 1], () =>
        fetchBooks(searchTerm, page + 1)
      );
    }
  }, [data, isPreviousData, page, queryClient, searchTerm]);

  const handleClick = (direction: string) => {
    if (direction === "next") {
      setPage((old) => old + 1);
    } else {
      setPage((old) => Math.max(old - 1, 1));
    }
  };
  console.log(page);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block z-0">
        <span className="relative text-6xl font-bold pb-3"> Biblioteca </span>
      </span>
      <form className="flex items-center space-x-6">
        <input
          className="bg-zinc-100 font-semibold mt-2 border-2 border-gray-300 p-2 rounded-md w-96 "
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for a book"
        />
      </form>
      {isLoading && (
        <span className="mt-3 loading loading-ring loading-lg"></span>
      )}
      {isError && <div>Algo deu errado.</div>}
      {data && (
        <div className="container">
          {data.map((book: any) => (
            <div
              className="p-2 border-solid border-2 border-zinc-500 rounded-lg text-center hover:bg-slate-200 m-4"
              key={book.key}
            >
              <Link
                className="text-base font-bold"
                href={`${book.key}`}
                as={`${book.key}`}
              >
                Título: {book.title}
                <div className="font-extralight">Autor: {book.author_name}</div>
                <div className="font-extralight">
                  Ano de lançamento: {book.first_publish_year}
                </div>
              </Link>
            </div>
          ))}
          {data.length > 1 && (
            <>
              <div className="flex items-center justify-around p-5">
                <button
                  className="btn ltr:ml-3 rtl:mr-3"
                  onClick={() => handleClick("prev")}
                >
                  Prev
                </button>

                <button className="btn" onClick={() => handleClick("next")}>
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
