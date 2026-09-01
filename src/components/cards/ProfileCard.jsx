import Card from './Card.jsx';

export default function ProfileCard({ children, ...props }) {
  return <Card {...props}>{children}</Card>;
}
