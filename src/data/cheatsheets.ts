export interface CheatSheet {
  id: string;
  languageId: string;
  title: string;
  description: string;
  content: string;
}

export const cheatsheets: CheatSheet[] = [
  // JavaScript Cheatsheets
  {
    id: 'js-array-methods',
    languageId: 'javascript',
    title: 'JavaScript Array Methods',
    description: 'Quick reference for commonly used array methods in JavaScript',
    content: `# JavaScript Array Methods

## Adding/Removing Elements
\`\`\`javascript
array.push(item)     // Add to end
array.pop()          // Remove from end
array.unshift(item)  // Add to start
array.shift()        // Remove from start
array.splice(start, deleteCount, ...items)
\`\`\`

## Array Transformations
\`\`\`javascript
array.map(fn)        // Transform elements
array.filter(fn)     // Filter elements
array.reduce(fn)     // Reduce to single value
array.sort(fn)       // Sort elements
array.reverse()      // Reverse order
\`\`\`

## Finding Elements
\`\`\`javascript
array.find(fn)       // Find first match
array.findIndex(fn)  // Find first match index
array.includes(item) // Check if includes
array.indexOf(item)  // Get index of item
\`\`\`
`
  },
  {
    id: 'js-promises',
    languageId: 'javascript',
    title: 'JavaScript Promises & Async/Await',
    description: 'Understanding asynchronous programming in JavaScript',
    content: `# Promises and Async/Await

## Promise Basics
\`\`\`javascript
new Promise((resolve, reject) => {
  // Async operation
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

// Promise chaining
promise
  .then(result => {})
  .catch(error => {})
  .finally(() => {});
\`\`\`

## Async/Await
\`\`\`javascript
async function getData() {
  try {
    const result = await fetch(url);
    const data = await result.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
\`\`\`
`
  },

  // Python Cheatsheets
  {
    id: 'python-lists',
    languageId: 'python',
    title: 'Python Lists and Tuples',
    description: 'Common operations with Python lists and tuples',
    content: `# Python Lists and Tuples

## List Operations
\`\`\`python
# Creating lists
list = [1, 2, 3]
list = list(range(5))

# Adding/Removing
list.append(item)    # Add to end
list.extend([4,5,6]) # Add multiple
list.insert(0, item) # Insert at index
list.pop()          # Remove from end
list.remove(item)   # Remove by value

# Slicing
list[start:end:step]
list[::-1]  # Reverse
\`\`\`

## Tuple Operations
\`\`\`python
# Creating tuples
tuple = (1, 2, 3)
tuple = 1, 2, 3

# Methods
len(tuple)
tuple.count(item)
tuple.index(item)
\`\`\`
`
  },

  // Java Cheatsheets
  {
    id: 'java-collections',
    languageId: 'java',
    title: 'Java Collections Framework',
    description: 'Overview of Java collections and their operations',
    content: `# Java Collections Framework

## ArrayList
\`\`\`java
// Creating
ArrayList<String> list = new ArrayList<>();

// Operations
list.add(element);
list.remove(index);
list.get(index);
list.size();
list.clear();

// Iteration
for (String item : list) {
    System.out.println(item);
}
\`\`\`

## HashMap
\`\`\`java
HashMap<String, Integer> map = new HashMap<>();
map.put(key, value);
map.get(key);
map.containsKey(key);
map.remove(key);
\`\`\`
`
  },
  {
    id: 'java-streams',
    languageId: 'java',
    title: 'Java Streams API',
    description: 'Modern Java stream operations and lambdas',
    content: `# Java Streams API

## Stream Operations
\`\`\`java
// Creating streams
list.stream()
Arrays.stream(array)
Stream.of(1, 2, 3)

// Common operations
stream.filter(x -> x > 5)
      .map(x -> x * 2)
      .collect(Collectors.toList())

// Reduction
stream.reduce(0, (a, b) -> a + b)
stream.count()
stream.max(comparator)
\`\`\`
`
  },

  // C++ Cheatsheets
  {
    id: 'cpp-stl',
    languageId: 'cpp',
    title: 'C++ STL Containers',
    description: 'Standard Template Library containers reference',
    content: `# C++ STL Containers

## Vector
\`\`\`cpp
vector<int> vec;
vec.push_back(1);
vec.pop_back();
vec.size();
vec[0];  // Access

// Iteration
for(auto& item : vec) {
    cout << item << endl;
}
\`\`\`

## Map
\`\`\`cpp
map<string, int> map;
map["key"] = 1;
map.find("key");
map.erase("key");
\`\`\`
`
  },
  {
    id: 'cpp-memory',
    languageId: 'cpp',
    title: 'C++ Memory Management',
    description: 'Smart pointers and memory management in modern C++',
    content: `# C++ Memory Management

## Smart Pointers
\`\`\`cpp
// Unique pointer
unique_ptr<Type> ptr = make_unique<Type>();
ptr->method();

// Shared pointer
shared_ptr<Type> ptr = make_shared<Type>();
auto count = ptr.use_count();

// Weak pointer
weak_ptr<Type> weak = ptr;
if(auto shared = weak.lock()) {
    // Use shared
}
\`\`\`
`
  }
];
