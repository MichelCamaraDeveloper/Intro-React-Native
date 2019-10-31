import React, {Component} from 'react';
import api from '../services/api';

import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

export default class Main extends Component {

  //adicionando titulo ao header da pagina.
  static navigationOptions = {
    title: "JSpédia"
  };

  state = {
    productInfo:{},
    docs: [],
    page:1,
  };

  loadProducts = async (page = 1) => {
    const response = await api.get(`/products?page=${page}`);

    const { docs, ...productInfo } = response.data;

    //O docs esta unindo dois arrays para quando vier itens da page 2
    //O Docs esta unindo, quando executado loadMore, os itens da array da page 1 
    // mais os itens da page 2.
    this.setState({
      docs:[... this.state.docs, ...docs], 
      productInfo, 
      page });
  };

  loadMore= () =>{
    const { page, productInfo }= this.state;
    
    if (page === productInfo.pages) return;
    //se nao (else)
    const pageNumber = page + 1;

    this.loadProducts(pageNumber);
  };


  //Elemento que é executado assim q o componente é montado na tela
  componentDidMount(){
    this.loadProducts();
  }

  renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Text style={styles.productTitle} > {item.title} </Text>
      <Text style={styles.productDescription} > {item.description} </Text>

      <TouchableOpacity 
        style={styles.productButton} 
        onPress={() => {
          this.props.navigation.navigate("Product", {product: item});
        }}
      >
        <Text style={styles.productButtonText}>Acessar</Text>
      </TouchableOpacity>

    </View>

  );

  render() {
    return (
      <View style={styles.container}>
        <FlatList 
          contentContainerStyle={styles.list}
          data={this.state.docs}
          keyExtractor={item => item._id}
          renderItem={ this.renderItem}
          //Essa funcao é automaticamente disparada quando se chega no fim da lista
          onEndReached={this.loadMore}
          // Define o percetual que eu quero chegar no fim da lista
          // para poder comecar a carregar mais itens.
          onEndReachedThreshold={0.1}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //Faz o container ocupar toda a tela
    flex:1,
    backgroundColor: "#fafafa"
  },

  list:{
    padding:20
  },

  productContainer:{
    backgroundColor: "#FFF",
    borderWidth:1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 20,
    marginBottom: 20
  },

  productTitle:{
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },

  productDescription:{
    fontSize:16,
    color:"#999",
    marginTop: 5,
    lineHeight: 24
  },

  productButton:{
    height: 42,
    borderRadius:5,
    borderWidth: 2,
    borderColor: "#DA552F",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },

  productButtonText:{
    fontSize: 16,
    color: "#DA552F",
    fontWeight:"bold"
  }

});

