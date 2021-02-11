import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import { Document } from "prismic-javascript/types/documents";
import PrismicDOM from "prismic-dom";
import { client } from "@/lib/prismic";

interface ProductProps {
  product: Document;
}

//LAZY LOAD DE COMPONENTE
//SSR = FALSE => Compomente sera renderizado pelo browser e nao pelo server-side(NodeJS)
//Assim, conseguimos utilizar comandos do browser, como document. window.

// const AddToCartModal = dynamic(() => import("@/components/AddToCartModal"), {
//   loading: () => <p>Loading...</p>,
//   ssr: false,
// });

export default function Products({ product }: ProductProps) {
  const router = useRouter();
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  // function handleAddToCart() {
  //   setIsAddToCartModalVisible(true);
  // }

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{PrismicDOM.RichText.asText(product.data.title)}</h1>

      <img src={product.data.thumbnail.url} width="300" alt="" />

      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDOM.RichText.asHtml(product.data.description),
        }}
      ></div>

      <p>Price: ${product.data.price}</p>

      {/* <button onClick={handleAddToCart}>Add to cart</button>

      {isAddToCartModalVisible && <AddToCartModal />} */}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  //Toda vez que o user entrar na pagina, essa pagina ira ser carregada.
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;

  const product = await client().getByUID("product", String(slug), {});

  return {
    props: {
      product,
    },
    revalidate: 5,
  };
};
