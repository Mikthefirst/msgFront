import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import debounce from "lodash.debounce";
import { search } from "./search.service";
import { createChat } from "./search.service";
import { SearchResultItem } from "./SearchResultItem";
import { useStore } from "../../../store/StoreContext";

const ConversationSearch: React.FC = observer(() => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userStore } = useStore(); // ✅ получаем userStore из контекста
  const { user } = userStore;

  const debouncedSearch = debounce(async (input: string) => {
    if (input.trim().length < 2) return;

    setLoading(true);
    try {
      const res = await search(input.trim());
      setResults(res);
    } catch (err) {
      console.error("Ошибка поиска:", err);
    } finally {
      setLoading(false);
    }
  }, 400);

  useEffect(() => {
    debouncedSearch(term);
    return () => debouncedSearch.cancel();
  }, [term]);

  const handleClick = async (item: any) => {
    if (!user) return;

    if (item.nickname?.startsWith("@")) {
      try {
        const chat = await createChat({ user2Id: item.id });
        console.log("Чат создан:", chat);
        // Можно добавить редирект в чат
      } catch (err) {
        console.log("Ошибка создания чата:", err);
      }
    } else {
      console.log("Открыть группу:", item);
    }
  };

  return (
    <div className="p-4">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Введите @nickname или $группу"
        className="w-full p-2 border rounded mb-2"
      />

      {loading && (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
        </div>
      )}

      <ul>
        {results.map((item) => (
          <SearchResultItem item={item} onClick={handleClick} term={term} />
        ))}
      </ul>
    </div>
  );
});

export default ConversationSearch;
