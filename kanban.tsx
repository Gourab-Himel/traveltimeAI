import { ChartComponent, Inject, SeriesCollectionDirective, SeriesDirective, Category, LineSeries } from '@syncfusion/ej2-react-charts';
 
const data: Object[] = [
    { month: 'Jan', sales: 35 }, { month: 'Feb', sales: 28 },
    { month: 'Mar', sales: 34 }, { month: 'Apr', sales: 32 },
    { month: 'May', sales: 40 }, { month: 'Jun', sales: 32 }
];
 
function App() {
  return <ChartComponent id="charts" primaryXAxis={{ valueType: 'Category' }}>
    <Inject services={[LineSeries, Category]} />
    <SeriesCollectionDirective>
      <SeriesDirective dataSource={data} xName='month' yName='sales' name='Sales' type='Line'/>
    </SeriesCollectionDirective>
  </ChartComponent>
}
export default App;