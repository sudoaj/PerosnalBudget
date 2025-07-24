import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageAdapter } from '@/lib/storage'
import { BudgetTemplate, BudgetPeriod } from '@/types/budget'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter

  beforeEach(() => {
    adapter = new LocalStorageAdapter()
    vi.clearAllMocks()
  })

  describe('template management', () => {
    it('should save and retrieve template', () => {
      const mockTemplate: BudgetTemplate = {
        id: '1',
        name: 'Test Template',
        items: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTemplate))

      adapter.saveTemplate(mockTemplate)
      const retrieved = adapter.getTemplate()

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'budget-template',
        JSON.stringify(mockTemplate)
      )
      expect(retrieved).toEqual(mockTemplate)
    })

    it('should return null when no template exists', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = adapter.getTemplate()

      expect(result).toBeNull()
    })
  })

  describe('periods management', () => {
    it('should save and retrieve periods', () => {
      const mockPeriods: BudgetPeriod[] = [
        {
          id: '1',
          name: 'Test Period',
          startDate: '2024-01-01',
          endDate: '2024-01-15',
          items: [],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPeriods))

      adapter.savePeriods(mockPeriods)
      const retrieved = adapter.getPeriods()

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'budget-periods',
        JSON.stringify(mockPeriods)
      )
      expect(retrieved).toEqual(mockPeriods)
    })
  })

  describe('data export/import', () => {
    it('should export data correctly', () => {
      const mockTemplate: BudgetTemplate = {
        id: '1',
        name: 'Test Template',
        items: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }
      const mockPeriods: BudgetPeriod[] = []
      const mockCurrentPeriodId = null

      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(mockTemplate))
        .mockReturnValueOnce(JSON.stringify(mockPeriods))
        .mockReturnValueOnce(mockCurrentPeriodId)

      const exported = adapter.exportData()
      const parsed = JSON.parse(exported)

      expect(parsed.template).toEqual(mockTemplate)
      expect(parsed.periods).toEqual(mockPeriods)
      expect(parsed.currentPeriodId).toEqual(mockCurrentPeriodId)
      expect(parsed.version).toBe('1.0.0')
    })

    it('should import data correctly', () => {
      const mockData = {
        template: {
          id: '1',
          name: 'Imported Template',
          items: [],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        periods: [],
        currentPeriodId: null,
      }

      const result = adapter.importData(JSON.stringify(mockData))

      expect(result).toEqual(mockData)
    })

    it('should throw error for invalid import data', () => {
      expect(() => {
        adapter.importData('invalid json')
      }).toThrow('Failed to import data')
    })
  })

  describe('clear all', () => {
    it('should remove all stored data', () => {
      adapter.clearAll()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('budget-template')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('budget-periods')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('budget-current-period-id')
    })
  })
})
