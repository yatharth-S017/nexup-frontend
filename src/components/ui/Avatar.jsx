export default function Avatar({ alt = '', src, ...props }) {
  return <img alt={alt} src={src} {...props} />;
}
