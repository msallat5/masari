// src/components/ApplicationForm.tsx
import { Form, Input, DatePicker, Select, Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Application } from '../types/application';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface ApplicationFormProps {
  initialValues?: Partial<Application>;
  onSubmit: (values: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const statusOptions = [
    { value: 'saved', label: t('status.saved') },
    { value: 'applied', label: t('status.applied') },
    { value: 'phone_screen', label: t('status.phone_screen') },
    { value: 'interview', label: t('status.interview') },
    { value: 'assessment', label: t('status.assessment') },
    { value: 'final_round', label: t('status.final_round') },
    { value: 'offer', label: t('status.offer') },
    { value: 'negotiating', label: t('status.negotiating') },
    { value: 'accepted', label: t('status.accepted') },
    { value: 'rejected', label: t('status.rejected') },
    { value: 'declined', label: t('status.declined') },
  ];

  const jobTypeOptions = [
    { value: 'full_time', label: t('jobType.full_time') },
    { value: 'part_time', label: t('jobType.part_time') },
    { value: 'contract', label: t('jobType.contract') },
    { value: 'internship', label: t('jobType.internship') },
    { value: 'remote', label: t('jobType.remote') },
    { value: 'hybrid', label: t('jobType.hybrid') },
    { value: 'onsite', label: t('jobType.onsite') },
  ];

  const sourceOptions = [
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Indeed', label: 'Indeed' },
    { value: 'Company Website', label: t('applications.companyWebsite') },
    { value: 'Referral', label: t('applications.referral') },
    { value: 'Job Fair', label: t('applications.jobFair') },
    { value: 'Other', label: t('applications.other') },
  ];

  const handleFinish = (values: any) => {
    // Normalize jobUrl: ensure it has a protocol
    let url = values.jobUrl?.trim() ?? '';
    if (url && !/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    const formatted: Omit<Application, 'id' | 'createdAt' | 'updatedAt'> = {
      ...values,
      dateApplied: (values.dateApplied as dayjs.Dayjs).format('YYYY-MM-DD'),
      jobUrl: url || undefined,
    };

    onSubmit(formatted);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        dateApplied: initialValues?.dateApplied
          ? dayjs(initialValues.dateApplied)
          : dayjs(),
      }}
      onFinish={handleFinish}
      className="application-form"
    >
      <div className="form-grid">
        <Form.Item
          name="company"
          label={t('applications.company')}
          rules={[{ required: true, message: t('applications.companyRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="position"
          label={t('applications.position')}
          rules={[{ required: true, message: t('applications.positionRequired') }]}
        >
          <Input />
        </Form.Item>
      </div>

      <div className="form-grid">
        <Form.Item name="location" label={t('applications.location')}>
          <Input />
        </Form.Item>

        <Form.Item
          name="dateApplied"
          label={t('applications.dateApplied')}
          rules={[{ required: true, message: t('applications.dateRequired') }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </div>

      <div className="form-grid">
        <Form.Item
          name="jobType"
          label={t('applications.jobType')}
          rules={[{ required: true, message: t('applications.jobTypeRequired') }]}
        >
          <Select>
            {jobTypeOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label={t('applications.status')}
          rules={[{ required: true, message: t('applications.statusRequired') }]}
          className="status-select"
        >
          <Select>
            {statusOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className="form-grid">
        <Form.Item name="source" label={t('applications.source')}>
          <Select>
            {sourceOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="jobUrl" label={t('applications.jobUrl')}>
          <Input prefix={<LinkOutlined />} placeholder="https://example.com/job" />
        </Form.Item>
      </div>

      <Form.Item name="notes" label={t('applications.notes')}>
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues?.id ? t('common.update') : t('common.save')}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default ApplicationForm;
