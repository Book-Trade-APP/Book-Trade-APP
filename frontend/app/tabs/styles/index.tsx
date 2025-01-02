import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        width: '90%',
        paddingHorizontal: 10,
    },
    searchImg: {
        marginRight: 8,
    },
    search: {
        flex: 1,
        height: 40,
    },
    categoryContainer: {
        borderRadius: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    categoryButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        margin: 5,
    },
    categoryLabel: {
        borderRadius: 5,
        height: 25
    },
    categoryLabelText: {
        fontSize: 14,
        color: '#222',
        fontWeight: 'bold',
    },
    searchWithCategory: {
         marginLeft: 8,
    },
    selectedCategoryButton: {
         backgroundColor: '#007BFF',
    },
    categoryText: {
        fontSize: 14,
        color: '#333',
    },
    selectedCategoryText: {
          color: '#fff',
    },
    content: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 20,
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        padding: 10,
        borderRadius: 8,
        width: width - 20,
        alignSelf: 'center',
    },
    productImage: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 8,
    },
    detailContainer: {
        flexDirection: 'column',
    },
    productTitle: {
        maxWidth: 260,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    author: {
        maxWidth: 260,
        fontSize: 12,
        paddingBottom: 10,
        color: '#777',
    },
    productPrice: {
        fontSize: 16,
        color: 'red',
    },
    footerText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 10,
        fontSize: 14,
    },
});