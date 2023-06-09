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
    <div>
      <h1>Biblioteca</h1>
      <form className="flex items-center space-x-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for a book"
        />
      </form>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Algo deu errado.</div>}
      {data && (
        <div>
          {data.map((book: any) => (
            <div key={book.key}>
              <Link href={`${book.key}`} as={`${book.key}`}>
                Título: {book.title}
                <div>Autor: {book.author_name}</div>
                <div>Ano de lançamento: {book.first_publish_year}</div>
              </Link>
              <hr />
            </div>
          ))}
          {data.length > 1 && (
            <>
              <button onClick={() => handleClick("prev")}>PREV</button>
              <button onClick={() => handleClick("next")}>NEXT</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
