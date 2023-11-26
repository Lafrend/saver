#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
using namespace std;

const int SIZE = 5;

void fillRandom(int arr[SIZE][SIZE]) {
    srand((unsigned int)time(0));;
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            arr[i][j] = rand() % 10;
        }
    }
}

void printArray(int arr[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            cout << arr[i][j] << " ";
        }
        cout << endl;
    }
}

void printSubArray(int arr[SIZE][SIZE], int startRow, int startCol, int subSize) {
    for (int i = startRow; i < startRow + subSize; i++) {
        for (int j = startCol; j < startCol + subSize; j++) {
            cout << arr[i][j] << " ";
        }
        cout << endl;
    }
}

int findMaxSubArraySum(int arr[SIZE][SIZE], int subSize, int& maxStartRow, int& maxStartCol) {
    int maxSum = INT_MIN;

    for (int i = 0; i <= SIZE - subSize; i++) {
        for (int j = 0; j <= SIZE - subSize; j++) {
            int sum = 0;
            for (int k = i; k < i + subSize; k++) {
                for (int l = j; l < j + subSize; l++) {
                    sum += arr[k][l];
                }
            }
            if (sum > maxSum) {
                maxSum = sum;
                maxStartRow = i;
                maxStartCol = j;
            }
        }
    }

    return maxSum;
}

int main() {
    setlocale(LC_ALL, "ru");

    int arr[SIZE][SIZE];
    fillRandom(arr);

    cout << "Исходный массив:" << endl;
    printArray(arr);

    int subSize;
    cout << "Введите размер подмассива (например, 2 для 2x2, 3 для 3x3 и т.д.): ";
    cin >> subSize;

    if (subSize > 0 && subSize <= SIZE) {
        int maxStartRow, maxStartCol;
        int maxSubArraySum = findMaxSubArraySum(arr, subSize, maxStartRow, maxStartCol);
        cout << "Максимальная сумма подмассива размером " << subSize << "x" << subSize << " равна: " << maxSubArraySum << endl;

        cout << "Подмассив:" << endl;
        printSubArray(arr, maxStartRow, maxStartCol, subSize);
    } else {
        cout << "Неверный размер подмассива." << endl;
    }

    return 0;
}