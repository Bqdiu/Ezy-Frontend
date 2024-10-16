import { RightOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import axios from "axios";
import React, { Suspense, useEffect, useReducer } from "react";
import { FaRegLightbulb } from "react-icons/fa6";

import { useLocation, useParams } from "react-router-dom";
const FilterBar = React.lazy(() =>
  import("../../../components/sorts/FilterBar")
);
const SortBar = React.lazy(() => import("../../../components/sorts/SortBar"));
const ShopCard = React.lazy(() => import("../../../components/shop/ShopCard"));
const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");
  const catIdExists =
    queryParams.has("cat_id") && queryParams.get("cat_id") !== "";

  const shopUsernameExists =
    queryParams.has("shop_username") && queryParams.get("shop_username") !== "";

  const catID = catIdExists ? queryParams.get("cat_id") : "";
  const shopUsername = shopUsernameExists
    ? queryParams.get("shop_username")
    : "";
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "FETCH_PRODUCT_BY_CATEGORY":
          return { ...state, listProductByCategory: action.payload };
        case "SET_LOADING":
          return { ...state, loading: action.payload };
        case "SET_CURRENT_PAGE":
          return { ...state, currentPage: action.payload };
        case "SET_TOTAL_PAGE":
          return { ...state, totalPage: action.payload };
        case "SET_SHOP":
          return { ...state, shop: action.payload };
        case "SET_FILTER":
          return {
            ...state,
            filter: {
              ...state.filter,
              ...action.payload,
            },
          };
        default:
          return state;
      }
    },
    {
      loading: false,
      listProductByCategory: [],
      currentPage: 1,
      totalPage: 0,
      filter: {
        sortBy: "pop",
        facet: [],
        price: {
          minPrice: null,
          maxPrice: null,
        },
        ratingFilter: null,
      },
      shop: null,
    }
  );
  const {
    listProductByCategory,
    currentPage,
    totalPage,
    filter,
    shop,
    loading,
  } = state;
  //side effect
  useEffect(() => {
    const fetchProductByCategory = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      console.log("current page: ", currentPage);
      const url = `${
        process.env.REACT_APP_BACKEND_URL
      }/api/search?keyword=${keyword}&pageNumbers=${currentPage}&sortBy=${
        filter.sortBy
      }&minPrice=${
        filter.price.minPrice ? filter.price.minPrice : ""
      }&maxPrice=${
        filter.price.maxPrice ? filter.price.maxPrice : ""
      }&ratingFilter=${
        filter.ratingFilter ? filter.ratingFilter : ""
      }&cat_id=${catID}&shop_username=${shopUsername}
      `;
      try {
        const response = await axios.get(url);

        if (response.status === 200) {
          console.log("response.data", response.data);
          if (response.data.shop !== null) {
            dispatch({ type: "SET_SHOP", payload: response.data.shop });
          }
          dispatch({
            type: "FETCH_PRODUCT_BY_CATEGORY",
            payload: response.data.products,
          });

          dispatch({
            type: "SET_TOTAL_PAGE",
            payload: response.data.totalPages,
          });
        }
        dispatch({ type: "SET_LOADING", payload: false });
      } catch (error) {
        console.log("Lỗi khi fetch dữ liệu product theo category: ", error);
      }
    };
    fetchProductByCategory();
  }, [currentPage, filter]);

  return (
    <div className="max-w-[1200px] mx-auto grid grid-cols-12 py-10">
      <div className="col-span-2">
        <Suspense fallback={<div>Loading...</div>}>
          <FilterBar
            enabledCategories={false}
            onFilterChange={(filter) => {
              dispatch({ type: "SET_FILTER", payload: filter });
              dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
              console.log("filter", filter);
            }}
            filter={filter}
          />
        </Suspense>
      </div>
      <div className="col-span-10">
        <section className="">
          {shop && !shopUsernameExists && (
            <>
              <div className="my-4 flex justify-between items-center text-slate-500 text-lg">
                <span className="">
                  SHOP LIÊN QUAN ĐẾN
                  <span className="text-primary">"{keyword}"</span>
                </span>
                <a
                  href={`/search_shop?keyword=${keyword}`}
                  className="text-base text-primary"
                >
                  Thêm Kết Quả <RightOutlined size={16} />
                </a>
              </div>
              <div className="w-full bg-white">
                <Suspense
                  fallback={
                    <Skeleton className="p-5" avatar paragraph={{ rows: 1 }} />
                  }
                >
                  <ShopCard value={shop} />
                </Suspense>
              </div>
            </>
          )}

          <div className="my-4 flex gap-3 items-center text-base text-slate-500">
            <FaRegLightbulb />
            <span>
              Kết quả tìm kiếm cho từ khóa '
              <span className="text-primary">{keyword}</span>'
            </span>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <SortBar
              listProductByCategory={listProductByCategory}
              currentPage={currentPage}
              totalPage={totalPage}
              loading={loading}
              filter={filter}
              onPageChange={(page) =>
                dispatch({ type: "SET_CURRENT_PAGE", payload: page })
              }
              onFilterChange={(filter) => {
                dispatch({ type: "SET_FILTER", payload: filter });
                dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
                console.log("filter", filter);
              }}
            />
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default SearchPage;
