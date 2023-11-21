#include <iostream>
using namespace std;

const int size = 10;

void FillArray(int** array)
{
    for (int i = 0; i < size; i++)
    {
        for (int j = 0; j < size; j++)
        {
            array[i][j] = rand() % 9 + 1;
        }
    }
}

void PrintArray(int** array)
{
    for (int i = 0; i < size; i++)
    {
        for (int j = 0; j < size; j++)
        {
            cout << array[i][j] << " ";
        }
        cout << endl;
    }
}

int main()
{
    int** arr = new int*[size];
    for (int i = 0; i < size; i++)
    {
        arr[i] = new int[size];
    }

    FillArray(arr);
    PrintArray(arr);

    // Don't forget to free the allocated memory
    for (int i = 0; i < size; i++)
    {
        delete[] arr[i];
    }
    delete[] arr;

    return 0;
}
