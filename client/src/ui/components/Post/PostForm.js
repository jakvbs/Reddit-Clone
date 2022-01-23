import classNames from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const PostSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, 'Title must be at least 2 characters long')
        .max(100, 'Title must be less than 100 characters long')
        .required('Title is required'),
    body: Yup.string(),
});

const PostForm = ({ submitForm, initialValues }) => {
    return (
        <Formik initialValues={initialValues} validationSchema={PostSchema} onSubmit={submitForm} enableReinitialize>
            {({ errors, touched }) => (
                <Form>
                    <div className="relative mb-2">
                        <Field
                            className={classNames(
                                'w-full bg-transparent px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600',
                                {
                                    'border-red-500': errors.title && touched.title,
                                }
                            )}
                            name="title"
                            type="text"
                            placeholder="Title"
                        />
                        <ErrorMessage className="font-medium text-red-600" name="title" component="small" />
                    </div>
                    <Field
                        component="textarea"
                        className={classNames(
                            'w-full h-48 p-3 border bg-transparent border-gray-300 rounded focus:outline-none focus:border-gray-600',
                            {
                                'border-red-500': errors.body && touched.body,
                            }
                        )}
                        name="body"
                        type="text"
                        placeholder="Body (optional)"
                    />
                    <ErrorMessage className="font-medium text-red-600" name="body" component="small" />
                    <div className="flex justify-end">
                        <button className="py-1 mt-2 gray button" type="submit">
                            Submit
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

PostForm.propTypes = {
    submitForm: PropTypes.func.isRequired,
    initialValues: PropTypes.instanceOf(Object),
};

PostForm.defaultProps = {
    initialValues: {
        title: '',
        body: '',
    },
};

export default PostForm;
