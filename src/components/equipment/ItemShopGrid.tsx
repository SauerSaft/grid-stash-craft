import { ShoppingBag, ShoppingCart } from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  price: number;
  amount: number;
}

const shopItems: ShopItem[] = [
  { id: "1", name: "Medikit", price: 250, amount: 10 },
  { id: "2", name: "Repairkit", price: 500, amount: 5 },
  { id: "3", name: "Schutzweste", price: 1500, amount: 3 },
  { id: "4", name: "Funkgerät", price: 300, amount: 5 },
  { id: "5", name: "Taschenlampe", price: 150, amount: 10 },
  { id: "6", name: "Adrenalin", price: 800, amount: 3 },
  { id: "7", name: "Handschellen", price: 200, amount: 10 },
  { id: "8", name: "Nagelbänder", price: 350, amount: 5 },
];

const formatPrice = (price: number) => `$${price.toLocaleString("de-DE")}`;

const ItemShopGrid = () => {
  return (
    <div className="ginshi_section">
      {/* Page Header */}
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <ShoppingBag size={14} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Item Shop</span>
          <span className="ginshi_section_header_subtitle">Kaufe Ausrüstung und Verbrauchsgüter für den Dienst</span>
        </div>
        <div className="ginshi_section_header_badges">
          <div className="ginshi_badge">
            <ShoppingBag size={10} className="ginshi_badge_icon" />
            <span className="ginshi_badge_value">{shopItems.length} Items</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ginshi_table_wrapper">
        <div className="ginshi_table_scroll">
          <table className="ginshi_table">
            <thead className="ginshi_thead">
              <tr className="ginshi_tr_head">
                <th className="ginshi_th">Name</th>
                <th className="ginshi_th ginshi_th_center itemshop_col_amount">Menge</th>
                <th className="ginshi_th ginshi_th_center itemshop_col_total">Gesamt</th>
                <th className="ginshi_th ginshi_th_right itemshop_col_action">Aktion</th>
              </tr>
            </thead>
            <tbody className="ginshi_tbody">
              {shopItems.map((item) => (
                <tr key={item.id} className="ginshi_tr">
                  {/* Name */}
                  <td className="ginshi_td">
                    <div className="ginshi_item_name">
                      <div className="ginshi_item_dot" />
                      <span className="ginshi_item_name_text">{item.name}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="ginshi_td ginshi_td_center itemshop_col_amount">
                    <div>
                      <span className="ginshi_stock_badge_mid ginshi_stock_badge">{item.amount}x</span>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="ginshi_td ginshi_td_center itemshop_col_total">
                    <div>
                      <span className="ginshi_text_num_bold">{formatPrice(item.price * item.amount)}</span>
                    </div>
                  </td>

                  {/* Buy Button */}
                  <td className="ginshi_td">
                    <div className="ginshi_table_actions">
                      <button className="ginshi_btn_info">
                        <ShoppingCart size={14} />
                        Kaufen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemShopGrid;
