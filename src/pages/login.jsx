import { Container, Box, Typography } from "@mui/material";
import Form from "../component/form";

const Login = () => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    console.log("Token not found");
  } else {
    console.log("Token exists");
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 2,
          p: 3,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        {/* Render the Form Component */}
        <Form />
      </Box>
    </Container>
  );
};

export default Login;