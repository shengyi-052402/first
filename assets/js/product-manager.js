
// 从本地存储加载商品数据，如果没有则使用空数组
let products = JSON.parse(localStorage.getItem('products')) || [
	{
		id:  1,
		name: 'avatar',
		price: 100000000000,
		stock: 1,
		status: "在售",
		image: '../assets/images/avatar2.jpg'
	},
	{
		id:  2,
		name: '陈逸嘉第一个非洲之心',
		price: 0,
		stock: 1,
		status: "在售",
		image: '../shouye/img/屏幕截图 2025-04-27 212642.png'
	},
];

// 全局变量跟踪编辑状态
window.editingProductId = null;

// 初始化事件监听器
function initEventListeners() {

    $('#model').find('.close').off('click').click(function() {
        // 重置表单
        $('#productName').val('');
        $('#productPrice').val('');
        $('#productNum').val('');
        $('#productImage').val('');
        window.currentImageData = null;
        window.editingProductId = null;
        $('#model').hide();
    });
    
    $('#readBtn').off('click').click(function() {
        const name = $('#productName').val();
        const price = parseFloat($('#productPrice').val());
        const num = parseInt($('#productNum').val());
        
        if (window.editingProductId) {
            const product = products.find(p => p.id === window.editingProductId);
            if (product) {
                product.name = name;
                product.price = price;
                product.stock = num;
                if (window.currentImageData) {
                    product.image = window.currentImageData;
                }
            }
        } else {
            const product = {
                id: products.length + 1,
                name: name,
                price: price,
                stock: num,
                status: "在售",
                image: window.currentImageData
            };
            products.push(product);
        }
        
        saveProducts();
        updateProductTable();
        
        // 重置表单
        $('#productName').val('');
        $('#productPrice').val('');
        $('#productNum').val('');
        $('#productImage').val('');
        window.currentImageData = null;
        window.editingProductId = null;
        
        $('#model').hide();
    });
}

// 添加商品
window.addProduct = function() {
    console.log('显示模态框');
    console.log('模态框元素:', $('#model'));
    console.log('模态框class:', $('#model').attr('class'));
    $('#model').show();
    console.log('添加show类后class:', $('#model').attr('class'));
    // 重置图片数据
    window.currentImageData = null;
    
    // 图片选择处理
    const fileInput = document.getElementById('productImage');
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                window.currentImageData = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        fileInput.value = '';
    };
    
    // 初始化事件监听器
    initEventListeners();
}

// 保存商品数据到本地存储
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// 更新商品表格
window.updateProductTable = function() {
    const tbody = $('#productTableBody');
    tbody.empty();
    
    products.forEach(product => {
        const row = `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.name}</td>
                <td>¥${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.status}</td>
                <td>
                    <button class="btn btn-sm" onclick="editProduct(${product.id})">编辑</button>
                    <button class="btn btn-sm" onclick="deleteProduct(${product.id})">删除</button>
                    <button class="btn btn-sm" onclick="toggleProductStatus(${product.id})">${product.status === '在售' ? '下架' : '上架'}</button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// 编辑商品
window.editProduct = function(id) {
    const product = products.find(p => p.id === id);
    
    window.editingProductId = id;
    
    // 预填充表单
    $('#productName').val(product.name);
    $('#productPrice').val(product.price);
    $('#productNum').val(product.stock);
    window.currentImageData = product.image;
    
    // 显示模态框
    $('#model').show();
    
    // 初始化事件监听器
    initEventListeners();
}

// 删除商品
window.deleteProduct = function(id) {
    products = products.filter(p => p.id !== id);
    saveProducts(); // 更新 localStorage
    updateProductTable();
}

// 搜索商品
window.searchProducts = function() {
    const keyword = $('#searchProduct').val().toLowerCase();
    if (!keyword) {
        updateProductTable();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(keyword) ||
        product.id.toString().includes(keyword)
    );
    
    const tbody = $('#productTableBody');
    tbody.empty();
    
    filteredProducts.forEach(product => {
        const row = `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.name}</td>
                <td>¥${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.status}</td>
                <td>
                    <button class="btn btn-sm" onclick="editProduct(${product.id})">编辑</button>
                    <button class="btn btn-sm" onclick="deleteProduct(${product.id})">删除</button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// 切换商品状态
window.toggleProductStatus = function(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.status = product.status === '在售' ? '下架' : '在售'; // 切换状态
        saveProducts(); // 更新 localStorage
        updateProductTable(); // 更新表格
    }
}

// 初始化
$(document).ready(function() {
    updateProductTable(); // 加载商品数据
    
    // 添加搜索框回车事件
    $('#searchProduct').on('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
}); 