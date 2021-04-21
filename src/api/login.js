import request from '@/utils/request'

export function get (params) {
    return request({
        url: '/api.php',
        method: 'get',
        params
    })
}