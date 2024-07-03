package com.example.employee_management;

import com.example.employee_management.model.Employee;
import com.example.employee_management.repository.EmployeeRepository;
import com.example.employee_management.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@SpringBootTest
public class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    public EmployeeServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetEmployeeById() {
        Employee employee = new Employee("1", "John", "Doe", "Developer", LocalDate.now(), 60000.0, LocalDate.of(1990, 1, 1));
        when(employeeRepository.findById("1")).thenReturn(Optional.of(employee));

        Optional<Employee> result = employeeService.getEmployeeById("1");
        assertTrue(result.isPresent());
        assertEquals(employee.getName(), result.get().getName());
    }

    @Test
    public void testSaveEmployee() {
        Employee employee = new Employee("1", "John", "Doe", "Developer", LocalDate.now(), 60000.0, LocalDate.of(1990, 1, 1));
        when(employeeRepository.save(employee)).thenReturn(employee);

        Employee result = employeeService.saveEmployee(employee);
        assertEquals(employee.getName(), result.getName());
    }

    @Test
    public void testDeleteEmployee() {
        String employeeId = "1";
        doNothing().when(employeeRepository).deleteById(employeeId);

        employeeService.deleteEmployee(employeeId);
        verify(employeeRepository, times(1)).deleteById(employeeId);
    }
}