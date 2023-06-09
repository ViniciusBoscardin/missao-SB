// import { GetServerSideProps } from "next";
import { GetServerSideProps, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect } from "react";

interface BookInfoProps {
  book: {
    title: string;
    author_name: string[];
    first_publish_year: number;
    cover_i: number;
  };
}

const fetchBookDetails = async (bookId: string) => {
  const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);
  const data = await response.json();
  console.log(data);
  return data;
};

export default function BookInfo({ params }: { params: { id: string } }) {
  const dataBook = use(fetchBookDetails(params.id));
  console.log(params, dataBook);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl mb-5 ">
        {dataBook.title || "Título não encontrado"}
      </h1>
      <div className="container mb-5">
        {dataBook.description || "Descrição não encontrada"}
      </div>
      {dataBook.covers && (
        <Image
          src={`https://covers.openlibrary.org/b/id/${dataBook.covers[0]}-M.jpg`}
          alt="image"
          width={300}
          height={400}
        />
      )}
      <div className="text-xs container mt-6 justify-center items-center">
        {dataBook.subjects || "Tags não encontradas"}
      </div>
      <Link href="/">
        <button className="btn">Back</button>
      </Link>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      params,
    },
  };
};
