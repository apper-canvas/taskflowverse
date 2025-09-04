const { ApperClient } = window.ApperSDK

// Initialize ApperClient
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const TABLE_NAME = 'category_c'

export const categoryService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}]
      }
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      // Transform database fields back to UI field names for compatibility
      return response.data.map(category => ({
        Id: category.Id,
        name: category.name_c,
        color: category.color_c,
        icon: category.icon_c
      }))
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ]
      }
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params)
      
      if (!response?.data) {
        throw new Error("Category not found")
      }

      // Transform database fields back to UI field names for compatibility
      const category = response.data
      return {
        Id: category.Id,
        name: category.name_c,
        color: category.color_c,
        icon: category.icon_c
      }
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error)
      throw new Error("Category not found")
    }
  },

  async create(categoryData) {
    try {
      const params = {
        records: [{
          Name: categoryData.name, // Required standard field
          name_c: categoryData.name,
          color_c: categoryData.color || "#6B7280",
          icon_c: categoryData.icon || "Grid3X3"
        }]
      }
      
      const response = await apperClient.createRecord(TABLE_NAME, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      const successful = response.results.filter(r => r.success)
      if (successful.length > 0) {
        const category = successful[0].data
        return {
          Id: category.Id,
          name: category.name_c,
          color: category.color_c,
          icon: category.icon_c
        }
      }
      
      throw new Error("Failed to create category")
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error)
      throw new Error("Failed to create category")
    }
  }
}