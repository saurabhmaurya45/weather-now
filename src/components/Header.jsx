import { CiSearch } from "react-icons/ci";
import { GoSearch } from "react-icons/go";
import { useEffect, useState } from "react";
import { Logo } from "../assets/logo";
import { FaSpinner } from "react-icons/fa";

const Header = ({ currentLocation, setCurrentLocation }) => {
  const [isSuggestionBoxOpen, setIsSuggestionBoxOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(currentLocation.longName);
  const [suggestionItems, setSuggestionItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestionItems = async () => {
    try {
      setLoading(true);
      const URL = `https://api.geoapify.com/v1/geocode/autocomplete?text=${searchValue}&apiKey=${
        import.meta.env.VITE_REVERSE_GEO_CODE
      }`;
      const res = await fetch(URL);
      const { features } = (await res.json()) ?? {};
      const formattedData = features?.map((item) => {
        const { formatted, lat, lon } = item.properties;
        return {
          lat,
          long: lon,
          longName: formatted,
        };
      });
      setSuggestionItems({ [searchValue]: formattedData });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length != 0) {
      setIsSuggestionBoxOpen(true);
    } else {
      setIsSuggestionBoxOpen(false);
    }
  };

  const onKeyDownHandler = (e) => {
    if (e.key === "Enter") {
      setIsSuggestionBoxOpen(false);
      searchHandler();
    }
  };

  const searchHandler = (item = "") => {
    setIsSuggestionBoxOpen(false);
    setCurrentLocation(item);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!suggestionItems[searchValue]) {
        fetchSuggestionItems();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <>
      <header className="px-8 md:px-16 lg:px-36 header bg-white  p-3 fixed w-[100%] top-0 items-center z-10 shadow-sm">
        <div className="flex items-center justify-between gap-x-4">
          <a
            to="/"
            className="md:w-[10%] cursor-pointer hover:scale-110 flex items-center"
          >
            <Logo width={40} height={40} />
          </a>
          <div className="relative w-full md:w-[60%] search-bar items-center flex justify-center">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-10 p-2 pl-5 rounded-l-full border  border-gray-200 appearance-none focus:outline-none "
              value={searchValue}
              onChange={(e) => onChangeHandler(e)}
              onFocus={() =>
                searchValue.length != 0 && setIsSuggestionBoxOpen(true)
              }
              onKeyDown={(e) => onKeyDownHandler(e)}
            />
            {loading && (
              <span className="absolute right-16 flex items-center">
                <FaSpinner className="animate-spin w-4 h-4" />
              </span>
            )}
            <span
              className="search-icon p-2 h-10 w-14 items-center center rounded-r-full cursor-pointer bg-gray-100"
              onClick={() => searchHandler()}
            >
              <CiSearch className="w-5 h-5 ml-2" />
            </span>
            {isSuggestionBoxOpen && suggestionItems[searchValue] && (
              <div className="absolute left-0 top-10 w-full z-10 flex justify-center items-center">
                <div className="w-full mr-12 rounded-lg bg-white py-2 shadow-lg">
                  <div className="suggestion-items">
                    <ul className="">
                      {suggestionItems[searchValue]?.map((item, index) => {
                        return (
                          <li
                            className="suggestion-item flex items-center hover:bg-gray-100 w-full p-1 font-normal text-balance cursor-default"
                            key={Math.random() * index}
                            onClick={() => {
                              setSearchValue(item.longName);
                              searchHandler(item);
                            }}
                          >
                            <span className="mx-6 mr-3 text-base">
                              <GoSearch />
                            </span>
                            {item.longName}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="md:w-[30%] h-10 hidden md:flex items-center justify-end text-lg font-medium overflow-hidden text-nowrap">
            {currentLocation.longName ?? ""}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
