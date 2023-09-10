export const Span: React.FC<{ bold?: any; style?: any }> = ({ children, bold, style }) => {
  return (
    <span
      style={{
        fontWeight: bold ? 700 : 400,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
