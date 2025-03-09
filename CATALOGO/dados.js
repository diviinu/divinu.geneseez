// Product data
const products = [
    {
      id: 1,
      name: "Camiseta Branca Clássica",
      price: 29.99,
      category: "t-shirts",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Camiseta básica de algodão premium com corte clássico e design minimalista perfeita para uso diário."
    },
    {
      id: 2,
      name: "Jeans Preto",
      price: 79.99,
      category: "pants",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Jeans preto elegante com caimento moderno. Feito com denim de alta qualidade com elasticidade para máximo conforto."
    },
    {
      id: 3,
      name: "Casaco de Lã",
      price: 199.99,
      category: "jackets",
      image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Elegante casaco de mistura de lã com silhueta sob medida. Perfeito para elevar seu visual de inverno."
    },
    {
      id: 4,
      name: "Camiseta Listrada",
      price: 34.99,
      category: "t-shirts",
      image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Camiseta clássica listrada em azul e branco feita de 100% algodão orgânico para uma sensação confortável e respirável."
    },
    {
      id: 5,
      name: "Calça Chino Slim",
      price: 69.99,
      category: "pants",
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Calça chino versátil com corte slim em cor bege neutra. Perfeita para ocasiões casuais e semi-formais."
    },
    {
      id: 6,
      name: "Relógio Minimalista",
      price: 129.99,
      category: "accessories",
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Relógio minimalista artesanal com pulseira de couro genuíno e caixa elegante de aço inoxidável."
    },
    {
      id: 7,
      name: "Camisa de Botão",
      price: 59.99,
      category: "t-shirts",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Camisa refinada feita de algodão premium com corte relaxado e textura sutil."
    },
    {
      id: 8,
      name: "Jaqueta Leve",
      price: 149.99,
      category: "jackets",
      image: "https://images.unsplash.com/photo-1557418669-db3f781a58c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Jaqueta ultra-leve que oferece calor excepcional sem volume. Capa externa resistente à água."
    },
    {
      id: 9,
      name: "Cinto de Couro",
      price: 49.99,
      category: "accessories",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Cinto de couro genuíno feito à mão com fivela de metal escovado. Design atemporal para qualquer roupa."
    }
  ];
  
  // Categories
  const categories = [
    { id: "all", name: "Todos" },
    { id: "t-shirts", name: "Camisetas" },
    { id: "pants", name: "Calças" },
    { id: "jackets", name: "Jaquetas" },
    { id: "accessories", name: "Acessórios" }
  ];
  