import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
  StatusBar,
  Platform,
  Modal,
} from "react-native";

import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "./src/types/Product";
import { productService } from "./src/services/productService";
import { ProductCard } from "./src/components/ProductCard";
import { ProductModal } from "./src/components/ProductModal";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  //Controle do modal
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [productToEdit, setProducttoEdit] = useState<Product | null>(null);

  //Função que vai buscar no back end os produtos
  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro ao carregar produtos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //antigo
  // useEffect(() => {
  //   fetchProducts();
  // }, [fetchProducts]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  //abrir modal para criar um novo produto
  const handleOpenCreateModal = () => {
    setProducttoEdit(null);
    setModalVisible(true);
  };

  // Abrir o modal para editar um produto
  const handleOpenEditModal = (product: Product) => {
    setProducttoEdit(product);
    setModalVisible(true);
  };

  //FUNÇÃO QUE SALVA A O CADASTRAR OU EDITAR
  const handleSaveProduct = async (
    productData: CreateProductDTO | UpdateProductDTO,
    id?: number | string,
  ) => {
    //PARA DIFERENCIAR A EDIÇÃO OU O CADASTRO É O RECEBIMENTO DO ID
    //SE RECEBER ID É EDIÇÃO SE NÃO É CADASTRO DE PRODUTOS
    if (id !== undefined && id !== null) {
      //edição
      await productService.updateProduct(id, productData);
    } else {
      //cadastro
      await productService.createProduct(productData);
    }
    //Atualizar lista
    await fetchProducts();
  };

  //função de excluir produtos
  const handleDeleteProduct = (product: Product) => {
    if (!product.id) return;

    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir ${product.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              //  ! diz para confiar que o id vai chegar
              await productService.deleteProduct(product.id!);
              Alert.alert("Sucesso", "Produto excluido com sucesso");
              await fetchProducts();
            } catch (error) {
              Alert.alert("Erro ao excluir produto");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleDeleteProductWeb = (product: Product) => {
    if (!product.id) return;

    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir ${product.nome}?`,
    );

    if (!confirmDelete) return;

    const deleteProduct = async () => {
      try {
        setLoading(true);

        await productService.deleteProduct(product.id!);

        window.alert("Produto excluído com sucesso!");

        await fetchProducts();
      } catch (error) {
        window.alert("Erro ao excluir produto");
      } finally {
        setLoading(false);
      }
    };

    deleteProduct();
  };

  return (
    //aqui
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Produtos</Text>
            <Text style={styles.subtitle}>
              Gerenciamento de Estoque & Catalogo
            </Text>
          </View>
          <TouchableOpacity
            style={styles.newProductButton}
            onPress={handleOpenCreateModal}
          >
            <Text style={styles.newProductButtonText}>+ Novo Produto</Text>
          </TouchableOpacity>
        </View>

        {/*CONTEUDO PRINCIPAL / LISTA DE PRODUTOS  */}
        {loading && refreshing ? (
          // quando estiver carregando vai aparecer essa view
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>CARREGANDO PRODUTOS...</Text>
          </View>
        ) : (
          // olhar aqui
          <FlatList
            data={products}
            keyExtractor={(item, index) =>
              item.id ? String(item.id) : String(index)
            }
            renderItem={({ item }) => (
              //isso daqui
              //aquiatem que chamar o product card/ igual
              <ProductCard
                item={item}
                handleOpenEditModal={handleOpenEditModal}
                // quando querer usar o de mobile
                handleDeleteProduct={handleDeleteProductWeb}
              />
            )}
            contentContainerStyle={styles.listContent}
            //aqui é para nao aparecer a barra lateral
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
                <Text style={styles.emptySubtitle}>
                  Clique no botão acima para cadastrar seu primeiro produto no
                  sistema.
                </Text>
                <TouchableOpacity
                  style={styles.emptyActionButton}
                  onPress={handleOpenCreateModal}
                >
                  <Text style={styles.emptyActionButtonText}>
                    Cadastrar Produto
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
        <ProductModal
          visible={modalVisible}
          productToEdit={productToEdit}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveProduct}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  newProductButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  newProductButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
  },

  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyActionButton: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  emptyActionButtonText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 14,
  },
});
