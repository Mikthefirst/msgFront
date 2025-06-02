import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import debounce from "lodash.debounce";
import { joinGroup, search } from "./search.service";
import { createChat } from "./search.service";
import { SearchResultItem } from "./SearchResultItem";
import { useStore } from "../../../store/StoreContext";

interface SearchResult {
  id: string;
  nickname?: string;
  username?: string;
  group_nickname?: string;
  groupName?: string;
  groupAvatar?: string;
}

const ConversationSearch: React.FC = observer(() => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { userStore, conversationStore } = useStore(); 
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

  useEffect(() => {
    if (term.trim() === "") {
      setResults([]);
    }
  }, [term]);

  const handleClick = async (item: any) => {
    if (!user) return;

    if (item.nickname?.startsWith("@")) {
      // direct message
      try {
        const chat = await createChat({ user2Id: item.id });
        console.log("Чат создан:", chat);
        conversationStore.setActiveConversation(chat.id); 
        await conversationStore.fetchConversations(); 

      } catch (err) {
        console.log("Ошибка создания чата:", err);
      }
    } else if (item.group_nickname?.startsWith("$")) {
      // group
      try {
        const group = await joinGroup({ conversationId: item.id });
        conversationStore.setActiveConversation(group.id);
        await conversationStore.fetchConversations(); 
      } catch (err) {
        console.log("Ошибка входа в группу:", err);
      }
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
        {results.length > 0 && (
          <ul>
            {results.map((item) => (
              <SearchResultItem
                key={item.id}
                item={item}
                onClick={handleClick}
                term={term}
              />
            ))}
          </ul>
        )}
      </ul>
    </div>
  );
});

export default ConversationSearch;
