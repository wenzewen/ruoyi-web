import request from '@/utils/request'

// 查询商品后端类型信息列表
export function listCategory(query) {
  return request({
    url: '/goods/category/list',
    method: 'get',
    params: query
  })
}

// 查询商品后端类型信息详细
export function getCategory(id) {
  return request({
    url: '/goods/category/' + id,
    method: 'get'
  })
}

// 新增商品后端类型信息
export function addCategory(data) {
  return request({
    url: '/goods/category',
    method: 'post',
    data: data
  })
}

// 修改商品后端类型信息
export function updateCategory(data) {
  return request({
    url: '/goods/category',
    method: 'put',
    data: data
  })
}

// 删除商品后端类型信息
export function delCategory(id) {
  return request({
    url: '/goods/category/' + id,
    method: 'delete'
  })
}
