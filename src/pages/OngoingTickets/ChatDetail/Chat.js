import OrderIssues from '../../../components/Shared/OrderDetail/OrderIssues';

export default function Chat({ order }) {
  return <OrderIssues flags={order?.flag} />;
}
